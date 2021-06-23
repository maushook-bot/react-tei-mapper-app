# Notes

## Technology Enterprise Edition 

This is a readme for the different features of Travel Net Solution's Mapping Solution

1. Mutiprocessor Contact Mapper
2. fuzzy-unit-mapper
3. res-classification-mapper

## 1. Mutiprocessor Contact Mapper
Business Requirements:-

During the contacts import process, EDI needs to validate whether or a not a contact exists in the track system, and if the contact does exists, return that contacts ID. If the contact does not exist, we need to create it, and on the successful creation of that contact, return the contact ID. 

## Introduction:-

The Contacts information of any source system is required to be mapped with the track's production.
The query from the source table will be used as a starting point to prepare the input table for the Contact API Mapper.

## Process:-

The following Contact Matching Combinations is being used by the Contact API Mapper:- 

 - Name Match Email/Phone Match Contacts: Match Code 1
    
    The Contact API Mapper will try posting the email to the destination environment and if the email exists in track, the logic would try to search for that email and return the Track Customer ID (Contact ID)
    The Validation Code or API Response Code 422 is used to understand that the email / Phone number exists or being used by a contact.
    The logic will try to match the source's first and last name with destination full name. If a match is found then the customer ID
    will be populated under "Name Match Email or Phone Match" category with an API filter code as "1"
    
 - Name Mismatch Email/Phone Match Contacts: Match Code 3
 
    The Contact API Mapper will try posting the email to the destination environment and if the email exists in track, the logic would try to search for that email and return the Track Customer ID (Contact ID)
    The Validation Code or API Response Code 422 is used to understand that the email / Phone number exists or being used by a contact.
    The logic will try to match the source's first and last name with destination full name.
    If there is no name match then the customer ID will be populated under "Name Mismatch Email or Phone Match" category with an API filter code as "3"
    
 - Contacts Created: Match Code 0
 
    The Contact API Mapper will try posting the email to the destination environment and if the email/Phone doesn't exist in track, then the contact will be created in track.
    The Created Contact's Customer ID will returned and the information will be populated under "Contacts Created" category with an API filter code as "0"

 - Unhandled Contacts: Match Code -1
 
    It is required the email/Phone payload of the API to be of correct format. An Email with invalid domain name will not be allowed to be created in track.
    So, any contacts unhandled by the Contact API Mapper will be populated under "Unhandled Contacts" category with an API filter code as "-1"      


## API Response

Status Code | Customer Id | Action
---| --- | ----
422 | Null | Customer Exist
422 | 34674637 | No Action. Ignore the record in source data.
201 | Null | Customer Created. Get the contact id from api response.
201 | 83925886 | No action. Ignore the record in source data.

## Matching Rules
Requirement:- Populate the Customer ID, No Identity & Track Data on different matching conditions

S.No | API Response | Match Condition | Match Code 
---| --- | ----- | ----
1 | 422 | Name and Email Match | 1
2 | 422 | Name Mismatch and Email Match | 3
3 | 201 | Contact Create | 0
4 | 422 | Name and Phone Match | 1
5 | 422 | First/Last Mismatch and Phone Match | 3
6 | 504 | HTTP Gateway TimeOut Error | -1
7 | 404 | Status Not Found | -1
8 |  | Unhandled/ Missing/ Index Error | -1

## Features:-
The Contact API Mapper uses the feature of Multiprocessing Module. The features are:-

 - This allows the matching logic to adapt to any conditions like irrespective of any source count
   
   ![Process Configurator](Images/process_configurator.png)
   
 - The process Configurator does the job of assigning the process count i.e blocks aacording to the source count
   Accordingly the source data frame will be split to several chunks.
   
   ![chunker](Images/chunker.png)

 - Chunker function does the job of splitting the dataframe to chunks or pieces using the number of process count information
 
   ![start_multiprocessor](Images/start_multiprocessor.png)
   
 - This function initializes the process to the splitted dataframes and assigns to each workers the task of calling the track API as seperate individual processes
   The Processes will start with a delay of 10 seconds to maintain stability of CPU load.
   Each worker will initiate the concurrent API calls to the track and output resultant data frame
   will append all the information.
   Output data will be available in track imports database under "tia_contact_import_processing" table
   
   ![contact_mprocessor](Images/contact_mprocessor.png)
   
 - This function is spawned as several processes by the Start_multiprocessor function. This starts the main function of Contact Matching and posting i.e "master_contact_processor" (explained below)
   Also, this function calls the hybrid_matcher_stats function which does the stats aggregation and populates them in "import_reporting" table under track_imports DB
   
   ![master_loop](Images/master_loop.png)
   
 - This function belongs to the contact_multi_processor function and it loops through each records/ rows of the source dataframe assigned by each workers from start_multiprocessor function
   This function does the post request and takes the decision of allocating the data under different categories with API Match codes 0,1,3,-1 ( explained in the previous section)
   
   
## How to run the Contact API Mapper?
  
   ![config_params](Images/config_params.png)

The screenshot is a sample config.ini format. The following user inputs are mandatory:

 - domain: The above example is the domain name of benington properties. (mandatory)
 - environment: prod/ stage3 Production or Sandbox environment (mandatory)
 - sandbox_refresh_flag: If set to 1 this will refresh the sandbox DB "track_imports_sandbox" customer table
   with the customer table info of bennington properties customer table from production. (Can always be set as 1)
 - cust_info: Escapia/v12/Streamline/Liverez/vrm/IQWare (Required for Reporting)
 - migration_phase: hist/initial/final/sandbox (Required for Reporting)
 - sandbox_domain: "tiasandbox" ( Default Test Environment)
 - sandbox_db: "track_imports_sandbox" (Database name)
 - source_sql: The source sql as a starting point varies according to the customer
 
 The source sql for different customer as follows:-
 
 - v12:- (eg: final phase, make sure to substitute the correct phase)
 
       SELECT DISTINCT r.Folio as folio, r.Guest, case when INSTR(r.Guest,',') = 0 THEN '.' WHEN INSTR(
       r.Guest,',') > 0 THEN trim(SUBSTR(r.Guest,INSTR(r.Guest,',')+1)) END AS first_name_src,
       CASE WHEN INSTR(r.Guest,', ') = 0 THEN TRIM(r.Guest) WHEN INSTR(r.Guest,',') > 0
       THEN trim(SUBSTR(r.Guest ,1, INSTR(r.Guest,',')-1)) END AS last_name_src, r.Email as email,
       NULL as phone_src, NULL as cell_phone_src, NULL as work_phone_src, NULL as other_phone_src,
       NULL AS fax, NULL as address1, NULL AS address2, NULL AS city, NULL AS state, NULL AS country, NULL AS zip
       FROM src_initial_v12_folio_audit_report f join
       src_initial_v12_reservations_made_report r ON f.`Folio Number` = r.Folio
       WHERE r.Email IS NOT NULL
   
   
 - Escapia:- (eg: initial phase) 
  
        SELECT distinct f.Booking_Number AS folio, f.First_Name AS first_name_src, f.Last_Name last_name_src, 
        f.Email as email, f.Email_2 AS email_2, 
        f.Phone_1 as phone_src, f.Phone_2 AS cell_phone_src, f.Phone_3 as work_phone_src, f.Phone_4 as other_phone_src,
        NULL AS fax, NULL as address1, NULL AS address2, NULL AS city, NULL AS state, NULL AS country, NULL AS zip
        FROM src_hist_escapia_booking_summary_report f 
        WHERE (f.Email IS NOT NULL OR f.Email_2 IS NOT NULL OR f.Phone_1 IS NOT NULL OR f.Phone_2 IS NOT Null
        OR f.Phone_3 IS NOT NULL OR f.Phone_4 IS NOT NULL);
 
     
 - Streamline:- (eg: hist phase)
 
       SELECT f.`Lease ID` AS folio, f.`Tenant First Name` AS first_name_src, f.`Tenant Last Name` AS
       last_name_src, f.`Tenant Email` as email, f.`Tenant Home #` as phone_src, f.`Tenant Cell #` AS
       cell_phone_src, NULL as work_phone_src, NULL as other_phone_src, 
       NULL AS fax, NULL as address1, NULL AS address2, NULL AS city, NULL AS state, NULL AS country, NULL AS zip
       FROM src_hist_streamline_reservation_analysis_report f
     
 - Liverez:- (eg: sandbox phase)
 
       SELECT f.`Transaction ID` AS folio, f.`First Name` AS first_name_src, f.`Last Name` AS
        last_name_src, f.Email AS email, f.Phone as phone_src, f.`Cell Phone` as cell_phone_src,
        NULL as work_phone_src, NULL as other_phone_src,
        NULL AS fax, NULL as address1, NULL AS address2, NULL AS city, NULL AS state, NULL AS country, NULL AS zip
        FROM src_initial_liverez_sales_cycle_report f
        WHERE f.`Last Name` IS NOT null
        AND (f.Email IS NOT NULL OR f.Phone IS NOT NULL OR f.`Cell Phone` IS NOT NULL)
 
    
 - vrm:- (eg: Initial phase)
 
       SELECT f.reservation_id AS folio, f.`first` AS first_name_src, f.`last` AS last_name_src, f.email,
       f.guest_cell AS phone_src, f.guest_phone AS cell_phone_src, f.evening_phone AS work_phone_src, NULL AS 
       other_phone_src,
       NULL AS fax, NULL as address1, NULL AS address2, NULL AS city, NULL AS state, NULL AS country, NULL AS zip 
       FROM src_{migration_phase}_vrm_reservation_info_export f   
 
 - Hostfully:-
 
        SELECT
        r.`Res#` AS folio, 
        r.`Guest First Name` AS first_name_src, r.`Guest Last Name` AS last_name_src, 
        r.`Guest Email` AS email, r.`Guest Phone Number` AS phone_src, r.`Guest Cell Phone Number` AS cell_phone_src,
        NULL as work_phone_src, NULL as other_phone_src,
        NULL AS fax, NULL as address1, NULL AS address2, NULL AS city, NULL AS state, NULL AS country, NULL AS zip 
        FROM src_initial_hostfully_booking_summary_report r
        WHERE (r.`Guest Email` IS NOT NULL OR r.`Guest Phone Number` IS NOT NULL OR r.`Guest Cell Phone Number` IS NOT NULL)
    
    
   Finally execute the main.py
   
  Note:- It is recommended to test the SQL in the track imports DB and do the necessary corrections if needed! 
 
     

SET SQL_MODE=ORACLE;

CREATE DATABASE BookingSystem;  /* Create database */

USE BookingSystem;  /* Switch to the database */

CREATE TABLE Customers (
    ID INT(11) unsigned NOT NULL AUTO_INCREMENT,  /* Auto assigns ID */
    firstName varchar(100) NOT NULL,
    surName varchar(100) NOT NULL,
    email varchar(100) NOT NULL,
    phoneNumber varchar(15) NOT NULL,  /* International standard */
    homeAddress varchar(100) NOT NULL,
    homeCountry varchar(100)  NOT NULL,
    latestBookingDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,  /* Use current time and date */
    PRIMARY KEY (ID)
);

CREATE TABLE Bookings (
    ID INT(11) unsigned AUTO_INCREMENT,  /* Auto assigns ID */
    customerID INT(11) unsigned NOT NULL,
    spotID INT(11) unsigned NOT NULL,
    bookingDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,  /* Use current time and date */
    startDate DATE NOT NULL,  /* Standard arriving time */
    endDate DATE NOT NULL,  /* Standard leaving time */
    adults INT NOT NULL,
    children INT NOT NULL,
    transactionPrice FLOAT NOT NULL,
    numberplate varchar(10),  /* NULL = no car (payment) */
    electricCar BOOL NOT NULL,
    notes MEDIUMTEXT,
    PRIMARY KEY (ID)
);

CREATE TABLE CampingSpots (
    ID INT(11) unsigned AUTO_INCREMENT,  /* Auto assigns ID */
    spotName varchar(10) NOT NULL,
    spotSize ENUM('Small', 'Medium', 'Big') NOT NULL,
    pricePerDay float NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE ActivitiesInfo (
    ID INT(11) unsigned AUTO_INCREMENT,  /* Auto assigns ID */
    activityName varchar(100) NOT NULL,
    discription MEDIUMTEXT,
    IMG_path varchar(100),
    startTime TIME,  /* Starting time of the day */
    EndTime TIME,    /* Ending time of the day*/
    maxPersons INT NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE Activities (
    activityID INT(11) unsigned NOT NULL,
    totalAduls INT NOT NULL,
    totalChildren INT NOT NULL,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL
);

CREATE TABLE ActivitySignups (
    activityID INT(11) unsigned NOT NULL,
    customerID INT(11) unsigned NOT NULL,
    adults INT NOT NULL,  /* Adults per singup */
    children INT NOT NULL  /* Children per singup */
);

CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
/*

INSERT INTO ActivitiesInfo (activityName, discription, startTime, EndTime, maxPersons) VALUES ('', '', );
DELETE 

SELECT * FROM Customers;  Read
UPDATE 
*/

package com.reachme.entity;

import com.sun.istack.NotNull;

import javax.persistence.*;

/**
 * <h1>Clasa-entitate Account</h1>
 * <h3>Modeleaza conceptul de user al aplicatiei web</h3>
 * <h3>Clasa curenta contine informatii referitoare la datele unui utilizator in cadrul retelei, ea fiind
 * o componenta de legatura intre aplicatie si baza de date.</h3>
 * <h3>Spring Boot va genera automat tabelul account in baza de date specificata in fisierul application.properties, iar toate
 * operatiile CRUD la nivelul de baza de date se vor realiza prin request-uri HTTP de la client la server si reciproc
 * (in functie de metoda in cauza).</h3>
 */

@Entity(name = "Account")
public class Account {

    /**<b>Camp din baza de date de tipul cheie primara (id-primary key)</b>*/
    @Id
    @SequenceGenerator(
            name = "account_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            generator = "account_sequence",
            strategy = GenerationType.SEQUENCE
    )

    /*Id utilizator, ce va fi generat in mod unic de catre aplicatie (partea de Firebase Authentication)*/
    private Integer identifier;

    /**<b>Camp nenul</b>*/
    @NotNull

    /*Identificator unic utilizator, ce va fi utilizat in integrarea backend-ului cu Firebase*/
    private String accountFirebaseIdentifier;

    /**<b>Nume de utilizator</b>*/
    private String accountUserName;

    /**<b>Link catre fotografia de profil</b>*/
    private String profilePhotoHref;

    /**<b>Numele din viata reala al utilizatorului</b>*/
    private String userRealName;

    /**<b>Adresa de email a utilizatorului</b>*/
    private String emailAddress;

    /**<h1>Constructor implicit</h1>*/
    public Account() {
    }

    /**<h1>Constructor de initializare al clasei</h1>*/
    public Account(Integer identifier, String accountFirebaseIdentifier, String userName, String profilePhotoHref, String accountRealName, String emailAddress) {
        this.identifier = identifier;
        this.accountFirebaseIdentifier = accountFirebaseIdentifier;
        this.accountUserName = userName;
        this.profilePhotoHref = profilePhotoHref;
        this.userRealName = accountRealName;
        this.emailAddress = emailAddress;
    }

    /**<h1>Getteri & Setteri clasa Account</h1>*/
    public Integer getIdentifier() {
        return identifier;
    }

    public String getUserFirebaseIdentifier() {
        return accountFirebaseIdentifier;
    }

    public void setUserFirebaseIdentifier(String userFirebaseIdentifier) {
        this.accountFirebaseIdentifier = userFirebaseIdentifier;
    }

    public String getUserName() {
        return accountUserName;
    }

    public void setUserName(String userName) {
        this.accountUserName = userName;
    }

    public String getProfilePhotoHref() {
        return profilePhotoHref;
    }

    public void setProfilePhotoHref(String profilePhotoHref) {
        this.profilePhotoHref = profilePhotoHref;
    }

    public String getUserRealName() {
        return userRealName;
    }

    public void setUserRealName(String userRealName) {
        this.userRealName = userRealName;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAdress) {
        this.emailAddress = emailAdress;
    }
}

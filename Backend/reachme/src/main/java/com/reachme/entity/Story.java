package com.reachme.entity;

import javax.persistence.*;
import java.sql.Timestamp;


/**
 * <h1>Clasa entitate Story</h1>
 * <h3>Modeleaza conceptul de poveste incarcabila pe reteaua de socializare.</h3>
 * <h3>Clasa curenta mentine informatii referitoare la continutul povestii incarcate de un anume utilizator, ea fiind
 * o componenta de legatura intre aplicatie si baza de date.</h3>
 * <h3>Spring Boot va genera automat tabelul Story in baza de date specificata in fisierul application.properties, iar toate
 * operatiile CRUD la nivelul de baza de date se vor realiza prin request-uri HTTP de la client la server si reciproc
 * (in functie de metoda in cauza).</h3>
 */

@Entity(name = "Story")
public class Story {

    /**
     * <b>Identificator Story, ce va fi o valoare numerica autoincrementabila.</b>
     */
    @Id
    @SequenceGenerator(
            name = "story_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            generator = "story_sequence",
            strategy = GenerationType.SEQUENCE
    )
    private Integer identifier;

    /**
     * <b>Identificatorul contului ce a efectuat postarea povestii pe reteaua de socializare (Foreign Key)</b>
     */
    private String accountIdentifier;

    /**
     * <b>Username-ul persoanei care a postat povestea</b>
     */
    private String owner;

    /**
     * <b>Identificator poveste, utilizat in payload pentru trimiterea si obtinerea unei anume povesti de la backend.</b>
     */
    private String storyIdentifier;

    /**
     * <b>Referinta (calea) catre fotografia/videoclipul incarcat de un utilizator ca si poveste pe platforma ReachMe</b>
     */
    private String uploadedMediaHref;

    /**
     * <b>Timestamp reprezentand momentul la care s-a efectuat inregistrarea postarii in baza de date</b>
     */
    private Timestamp timeStamp;

    /**
     * <h1>Constructori clasa entitate Story </h1>
     * <b>Constructor de initializare</b>
     */
    public Story(Integer identifier, String accountIdentifier, String storyIdentifier, String uploadedMediaHref, Timestamp timeStamp) {
        this.identifier = identifier;
        this.accountIdentifier = accountIdentifier;
        this.storyIdentifier = storyIdentifier;
        this.uploadedMediaHref = uploadedMediaHref;
        this.timeStamp = timeStamp;
    }

    /**
     * <b>Constructor implicit</b>
     */
    public Story() {
    }

    /**
     * <h1>Metode accesor si mutator (getters & setters) pentru accesarea  membrilor protejati ai clasei entitate Story</h1>
     */

    public Integer getIdentifier() {
        return identifier;
    }

    public String getAccountIdentifier() {
        return accountIdentifier;
    }

    public void setAccountIdentifier(String accountIdentifier) {
        this.accountIdentifier = accountIdentifier;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getStoryIdentifier() {
        return storyIdentifier;
    }

    public void setStoryIdentifier(String storyIdentifier) {
        this.storyIdentifier = storyIdentifier;
    }

    public String getUploadedMediaHref() {
        return uploadedMediaHref;
    }

    public void setUploadedMediaHref(String uploadedMediaHref) {
        this.uploadedMediaHref = uploadedMediaHref;
    }

    public Timestamp getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(Timestamp timeStamp) {
        this.timeStamp = timeStamp;
    }
}

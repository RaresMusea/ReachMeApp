package com.reachme.entity;

import javax.persistence.*;
import java.sql.Timestamp;


/**
 * <h1>Clasa entitate Comment</h1>
 * <h3>Modeleaza conceptul de comentariu la o postare incarcata pe reteaua de socializare.</h3>
 * <h3>Clasa curenta mentine informatii referitoare la comentariile uneia/a mai multor postari, ea fiind
 * o componenta de legatura intre aplicatie si baza de date.</h3>
 * <h3>Spring Boot va genera automat tabelul comment in baza de date specificata in fisierul application.properties, iar toate
 * operatiile CRUD la nivelul de baza de date se vor realiza prin request-uri HTTP de la client la server si reciproc
 * (in functie de metoda in cauza).</h3>
 */

@Entity(name = "Comment")
public class Comment {

    /**
     * <b>Cheie primara pentru tabela SQL</b>
     */
    @Id
    @SequenceGenerator(
            name = "comment_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            generator = "comment_sequence",
            strategy = GenerationType.SEQUENCE
    )

    /*Identificator postare- cheie primara autogenerata si autoincrementata*/
    private Integer identifier;

    /**
     * <b>Identificator de tip string al unui comentariu</b>
     */
    private String commentIdentifier;

    /**
     * <b>Timestamp comentariu</b>
     */
    private Timestamp timestamp;

    /**
     * <b>Continutul unui comentariu (comentariul in sine)</b>
     */
    private String content;

    /**
     * <b>Identificatorul user-ului care a postat comentariul</b>
     */
    private String accountIdentifier;

    /**
     * <b>Identificatorul postarii la care au fost adaugate comentarii</b>
     */
    private String postIdentifier;

    /**
     * <b>Username-ul utilizatorului care a adaugat un comentariu la o postare</b>
     */
    private String commentAuthor;

    /**
     * <h1>Constructori clasa Comment:</h1>
     * <h3>Constructor implicit:</h3>
     */
    public Comment() {
    }

    /**
     * <h3>Constructor de initializare</h3>
     */

    public Comment(Integer identifier, String commentIdentifier, Timestamp timestamp, String content, String accountIdentifier, String postIdentifier) {
        this.identifier = identifier;
        this.commentIdentifier = commentIdentifier;
        this.timestamp = timestamp;
        this.content = content;
        this.accountIdentifier = accountIdentifier;
        this.postIdentifier = postIdentifier;
        this.commentAuthor = "";
    }

    /**
     * <h1>Getters & setters pentru clasa entitate Comment</h1>
     */
    public Integer getIdentifier() {
        return identifier;
    }

    public void setIdentifier(Integer identifier) {
        this.identifier = identifier;
    }

    public String getCommentIdentifier() {
        return commentIdentifier;
    }

    public void setCommentIdentifier(String commentIdentifier) {
        this.commentIdentifier = commentIdentifier;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAccountIdentifier() {
        return accountIdentifier;
    }

    public void setAccountIdentifier(String accountIdentifier) {
        this.accountIdentifier = accountIdentifier;
    }

    public String getPostIdentifier() {
        return postIdentifier;
    }

    public void setPostIdentifier(String postIdentifier) {
        this.postIdentifier = postIdentifier;
    }

    public String getCommentAuthor() {
        return commentAuthor;
    }

    public void setCommentAuthor(String commentAuthor) {
        this.commentAuthor = commentAuthor;
    }
}

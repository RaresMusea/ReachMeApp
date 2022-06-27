package com.reachme.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

/**
 * <h1>Clasa entitate Post</h1>
 * <h3>Modeleaza conceptul de postare in cadrul aplicatiei web ReachMe.</h3>
 * <h3>Clasa curenta mentine informatii referitoare la postarea/postarile incarcate de un anume utilizator, ea fiind
 * o componenta de legatura intre aplicatie si baza de date.</h3>
 * <h3>Spring Boot va genera automat tabelul post in baza de date specificata in fisierul application.properties, iar toate
 * operatiile CRUD la nivel de baza de date se vor realiza prin request-uri HTTP de la client la server si reciproc
 * (in functie de metoda utilizata).</h3>
 */

@Entity(name = "Post")
public class Post {

    /**<b>Cheie primara tabela SQL:ID postare</b>*/
    @Id
    @SequenceGenerator(
            name = "post_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            generator = "post_sequence",
            strategy = GenerationType.SEQUENCE
    )
    /*Identificator unic postare<*/
    private Integer identifier;

    /**<b>Identificator postare de tip String</b>*/
    private String postIdentifier;

    /**<b>Locatia la care s-a efectuat o postare</b>*/
    private String location;

    /**<b>Calea catre resursa incarcata in cadrul postarii (Path din Firebase Storage stocat sub forma unei adrese URL)</b>*/
    private String uploadedMediaHref;

    /**<b>Calea catre fotografia de profil a utilizatorului ce a incarcat postarea (URL catre Firebase Storage)</b>*/
    private String postOwnersProfilePicture = "";

    /**<b>Descrierea din postare</b>*/
    private String postDescription;

    /**<b>Momentul (data) la care s-a efectuat postarea pe reateaua sociala</b>*/
    private Timestamp timestamp;

    /**<b>Numar de like-uri obtinute in cadrul postarii</b>*/
    private Integer likes;

    /**<b>Numar de dislike-uri obtinute in cadrul postarii</b>*/
    private Integer dislikes;

    /**<b>Identificatorul user-ului care a efectuat postarea</b>*/
    private String accountIdentifier;

    /**<b>Numele utilizatorului care a incarcat o postare.</b>*/
    private String postOwner;

    /**<b>Colectie de elemente responsabila de stocarea in baza de date a utilizatorilor care au apreciat postarea curenta</b>*/
    @ElementCollection
    private Set<String> likedBy = new HashSet<>();

    /**<b>Colectie de elemente responsabila de stocarea in baza de date a utilizatorilor care au subapreciat postarea curenta</b>*/
    @ElementCollection
    private Set<String> dislikedBy = new HashSet<>();

    /**<h1>Constructori:</h1>
    *<b>Constructor de initializare al clasei</b>
     */
    public Post(Integer identifier, String postIdentifier, String location, String uploadedMediaHref, String postOwnersProfilePicture, String postDescription, Timestamp timestamp, Integer likes, Integer dislikes, String accountIdentifier) {
        this.identifier = identifier;
        this.postIdentifier = postIdentifier;
        this.location = location;
        this.uploadedMediaHref = uploadedMediaHref;
        this.postOwnersProfilePicture = postOwnersProfilePicture;
        this.postDescription = postDescription;
        this.timestamp = timestamp;
        this.likes = likes;
        this.dislikes = dislikes;
        this.accountIdentifier = accountIdentifier;
    }

    /**<b>Constructorul implicit al clasei</b>*/
    public Post() {
    }

    /**<h1> Getteri si setteri clasa Post</h1>*/
     public Integer getIdentifier() {
        return identifier;
    }

    public String getPostIdentifier() {
        return postIdentifier;
    }

    public void setPostIdentifier(String postIdentifier) {
        this.postIdentifier = postIdentifier;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getUploadedMediaHref() {
        return uploadedMediaHref;
    }

    public String getPostOwnersProfilePicture() {
        return postOwnersProfilePicture;
    }

    public void setPostOwnersProfilePicture(String postOwnersProfilePicture) {
        this.postOwnersProfilePicture = postOwnersProfilePicture;
    }

    public void setUploadedMediaHref(String uploadedMediaHref) {
        this.uploadedMediaHref = uploadedMediaHref;
    }

    public String getPostDescription() {
        return postDescription;
    }

    public void setPostDescription(String postDescription) {
        this.postDescription = postDescription;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    public Integer getLikes() {
        return likes;
    }

    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    public Integer getDislikes() {
        return dislikes;
    }

    public void setDislikes(Integer dislikes) {
        this.dislikes = dislikes;
    }

    public String getAccountIdentifier() {
        return accountIdentifier;
    }

    public void setAccountIdentifier(String accountIdentifier) {
        this.accountIdentifier = accountIdentifier;
    }

    public String getPostOwner() {
        return postOwner;
    }

    public void setPostOwner(String postOwner) {
        this.postOwner = postOwner;
    }

    public Set<String> getLikedBy() {
        return likedBy;
    }

    public void addLike(String userIdentifier) {
        this.likedBy.add(userIdentifier);
    }

    public void setLikedBy(Set<String> likedBy) {
        this.likedBy = likedBy;
    }

    public void setDislikedBy(Set<String> dislikedBy) {
        this.dislikedBy = dislikedBy;
    }

    public Set<String> getDislikedBy() {
        return dislikedBy;
    }

    public void addDislike(String userIdentifier) {
        this.dislikedBy.add(userIdentifier);
    }

    public void removeLike(String userIdentifier) {
        this.likedBy.remove(userIdentifier);
    }

    public void removeDislike(String userIdentifier) {
        this.dislikedBy.remove(userIdentifier);
    }
}

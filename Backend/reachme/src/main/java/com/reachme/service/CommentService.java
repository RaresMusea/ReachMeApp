package com.reachme.service;

import com.reachme.entity.Account;
import com.reachme.entity.Comment;
import com.reachme.repo.ICommentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

/**
 * <h1>Clasa CommentService</h1>
 * <h3>Implementeaza serviciul ce permite utilizarea metodelor REST API specifice, pentru obtinerea, editarea
 * respectiv adaugarea de noi comentarii la anumite postari ale utilizatorilor din cadrul aplicatiei.</h3>
 * <h3>Pentru a putea updata in timp real baza de date, serviciul curent integreaza o instanta a interfetei ICommentRepository, prin intermediul injectiei de dependinta.</h3>
 * <h3>Integrarea interfetei in cadrul serviciului va permite accesul la toate metodele de scriere/citire/editare din cadrul interfetei pe care repository-ul o mosteneste.</h3>
 */

@Service
public class CommentService {

    /**
     * <b>Instanta a interfetei ICommentRepository, instantiata prin intermediul injectiei de dependinta</b>
     */
    private final ICommentRepository commentRepository;

    /**
     * <h1>Constructorii serviciului CommentService</h1>
     * <b>Constructor de initializare, utilizeaza injectia de dependinta in vederea instantierii obiectului de tip ICommentRepository</b>
     *
     * @param commentRepository <b>instanta repository-ului responsabil de gestionarea entitatii de tip comentariu in cadrul aplicatiei.</b>
     */
    public CommentService(ICommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    /**
     * <b> Permite obtinerea, sub forma unei colectii de tip lista, a tuturor
     * comentariilor inregistrate in baza de date a aplicatiei, pentru o postare identificata in baza identificatorului sau.
     * Metoda va fi mai apoi apelata din cadrul clasei CommentController, in vederea implementarii facilitatii metodei de
     * GET efectuate la nivel de http request asupra unei entitati de tip Post.</b>
     */

    public List<Comment> retrieveCommentsMetadataForPost(String postIdentifier) {

        List<Comment> commentsList = commentRepository.findAll();
        //Comuncarea intre 2 microservicii:

        RestTemplate template = new RestTemplate();

        commentsList.forEach(comment -> {
            String route = "http://localhost:8080/account/{identifier}";

            String id = comment.getAccountIdentifier();
            System.out.println(id);

            Account temp = template.getForObject(route, Account.class, id);
            comment.setCommentAuthor(temp.getUserName());
        });

        return commentsList;
    }

    /**
     * <b> Permite trimiterea catre baza de date a metadatelor aferente unei entitati de tip Comment. Aceasta metoda apeleaza metoda save(), din interfata JpaRepository, pe care repository-ul
     * IStoryRepository o mosteneste.</b><br/><br/>
     *
     * <b>Apelul metodei save() are ca efect salvarea payload-ului transmis ca si parametru metodei, in baza de date a aplicatiei.
     * Metoda va fi apelata (in cascada) in final din cadrul Controller-ului, in vederea asigurarii functionalitatii metodei de POST
     * din REST API-ul pe care il vom integra in cadrul aplicatiei web.</b>
     */
    public Comment sendCommentMetadata(Comment comm) {
        return commentRepository.save(comm);
    }

}

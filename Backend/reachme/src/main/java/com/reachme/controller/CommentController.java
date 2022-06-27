package com.reachme.controller;

import com.reachme.entity.Comment;
import com.reachme.service.CommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**<h1>Clasa CommentController</h1>

<h3>Controller REST ce va fi utilizat pentru implementarea la nivel de baza a request-urilor din cadrul aplicatiei ce vor
fi executate asupra entitatilor de tipul comentariu.</h3>

<h3>Toate metodele necesare pentru realizarea acestor request-uri vor fi definite si implementate in cadrul acestei clase.</h3>

<h3>Prin intermediul endpoint-ului /comments-section, respectiv /comments-section/{id} utilizatorul va putea adauga si
implicit, vizualiza comentarii ale postarilor  din cadrul aplicatiei.</h3>

<h3>In vederea stabilirii unei conexiuni intre aplicatie si baza de date mySQL, cele 2 metode implementate vor utiliza un
serviciu (instanta a clasei StoryService) care in cadrul clasei a fost adaugat prin intermediul
injectiei de dependinta (Dependency Injection).</h3>

<h3>Obtinerea din serviciu a camentariului/comentariilor, sau actualizarea bazei de date cu noi astfel de entitati va fi realizabila doar
prin implementarea unei interfete de tip Repository care sa mosteneasca o alta astfel de interfata, care sa contina cel
putin o metoda de adaugare si una de obtinere a acestor informatii.
Instanta interfetei IStoryRepository va putea fi integrata in cadrul serviciului, tot prin intermediul
injectiei de dependinta.</h3>
*/

@RestController
@RequestMapping("/comments-section")
public class CommentController {

    /**<b>Injectia de dependinta, pentru adaugarea serviciului</b>*/
    private final CommentService commentService;

    /**<h1>Constructor implicit</h1>
     *
     * @param commentService <b>instanta a clasei CommentService, serviciul Spring ce va asigura functionalitatea request-urilor ce au loc la nivel de comentariile din cadrul aplicatiei.</b>
     */
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    /**<h1>Metoda GET</h1>
    *<h3>Returnează un obiect de tipul List<Comment> in care vor fi stocate toate comentariile adaugate
    *la o anume postare, identificata pe baza identificatorului postIdentifier.</h3>
     * @param postId <b>identificatorul unic al unei postari</b><br/>
     * @return <b>O lista a tuturor comentariilor primite in cadrul postarii identificate</b> */
    @GetMapping("{postIdentifier}")
    public List<Comment> retrieveComments(@PathVariable("postIdentifier") String postId) {
        return commentService.retrieveCommentsMetadataForPost(postId);
    }

    /**<h1>Metoda POST</h1>
    <h3>Confera functionalitatea metodei POST din cadrul REST API-ului pe care aplicatia fullstack il va
    integra. Metoda primeste drept parametru de intrare o referinta (instanta) a entitatii Comment, pe care o va trimite
    mai departe catre backend-ul aplicatiei drept payload, in format .JSON.</h3>
     *@param  comm <b>payload-ul request-ului (o instanta a entitatii Comment)</b><br/>
     *@return <b>O instanta a clasei Comment ce referentiaza comentariul incarcat in baza de date a aplicatiei</b>.*/
    @PostMapping("")
    public Comment addComment(@RequestBody Comment comm) {
        return commentService.sendCommentMetadata(comm);
    }
}

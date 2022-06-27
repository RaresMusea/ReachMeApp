package com.reachme.controller;

import com.reachme.entity.Post;
import com.reachme.misc.EditPostPayload;
import com.reachme.repo.IPostRepository;
import com.reachme.service.PostService;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

/**
 * <h1>Clasa PostController</h1>
 *
 * <h3>Controller REST ce va fi utilizat pentru implementarea la nivel de baza a request-urilor din cadrul aplicatiei ce vor
 * fi executate asupra entitatilor de tipul postare.</h3>
 *
 * <h3>Toate metodele necesare pentru realizarea acestor request-uri vor fi definite si implementate in cadrul acestei clase.</h3>
 *
 * <h3>Prin intermediul endpoint-ului /feed/post, utilizatorul va putea incarca si vizualiza postari in cadrul aplicatiei.</h3>
 *
 * <h3>In vederea stabilirii unei conexiuni intre aplicatie si baza de date mySQL, cele 2 metode implementate vor utiliza un
 * serviciu (instanta a clasei StoryService) care in cadrul clasei a fost adaugat prin intermediul
 * injectiei de dependinta (Dependency Injection).</h3>
 *
 * <h3>Obtinerea din serviciu a postarii/postarilor, sau actualizarea bazei de date cu noi astfel de entitati va fi realizabila doar
 * prin implementarea unei interfete de tip Repository care sa contina o metoda de adaugare si una de obtinere a acestor
 * informatii. Instanta interfetei IStoryRepository va putea fi integrata in cadrul serviciului, tot prin intermediul
 * injectiei de dependinta.</h3>
 */

@RestController
@RequestMapping("feed/post")
public class PostController {

    /**
     * <b>Serviciul de tip postare</b>
     */
    private final PostService postService;


    /**
     * <h1>Constructor implicit</h1>
     *
     * @param postService <b>serviciul de tip postare ce contine metode ce asigura comunicarea dintre entitatea de tip postare si reprezentarea acesteia in baza de date a aplicatiei.</b>
     *
     *                    <br>
     *                    <b>Cei 2 parametri vor fi initializati prin injectie de dependinta.</b>
     */
    public PostController(PostService postService) {
        this.postService = postService;
    }

    /**
     * <h1>Metoda GET</h1>
     * <h3>Returnează un obiect de tipul List<Post> in care vor fi stocate toate postarile
     * relevante pentru un utilizator (atât postarile încărcate de el însuși, cat si cele încărcate de alti utilizatori).</h3>
     *
     * @return <b>O lista a tuturor postarilor inregistrate in cadrul aplicatiei</b>
     */
    @GetMapping("")
    public List<Post> retrievePosts() {
        return postService.getPostsMetadata();
    }

    /**
     * <h1>Metoda POST</h1>
     * <h3>confera functionalitatea metodei POST din cadrul REST API-ului pe care aplicatia fullstack il va
     * integra. Metoda primeste drept parametru de intrare o referinta (instanta) a entitatii Post, pe care o va trimite
     * mai departe catre backend-ul aplicatei, drept payload, in format .JSON.</h3>
     *
     * @param payload <b>instanta a entitatii Post, reprezentand payload-ul HTTP request-ului, contine elementele definite de catre utilizator in cadrul unei postari</b>
     * @return <b>O instanta a clasei Post reprezentand postarea ce tocmai a fost adaugata</b>
     */
    @PostMapping("")
    public Post sendPost(@RequestBody Post payload) {
        return postService.sendPostMetadata(payload);
    }

    /**
     * <h1>Metoda PATCH</h1>
     * <h3>Confera functionalitatea uneia din cele 4 metode de PATCH din cadrul REST API-ului pe care
     * aplicatia le va utiliza in cadrul entitatilor de tip postare. Metoda primeste drept parametru un identificator unic
     * al unei astfel de entitati, pe care il va utiliza pentru a creste valoarea field-ului likes, asociat numarului de like-uri
     * pe care un utilizator le poate primi la o postare incarcata, dar si pentru a actualiza field-ul likedBy, cu o lista a
     * identificatorilor entitatilor de tip Account care au dat like acelei postari.</h3>
     *
     * @param postId    <b>identificatorul unic al postarii asupra careia se efectueaza cresterea numarului de like-uri</b>
     * @param accountId <b>Identificatorul unic al contului ce a reactionat cu like unei postari.</b>
     * @return <b>Un Response Entity de tipul entitatii Postare cu postarea modificata</b>
     */
    @PatchMapping("/increase-likes/{postIdentifier}/{accountIdentifier}")
    public ResponseEntity<Post> increaseLikesCount(@PathVariable("postIdentifier") String postId,
                                                   @PathVariable("accountIdentifier") String accountId)
            throws ResourceNotFoundException {
        return postService.increaseLikes(postId, accountId);
    }

    /**
     * <h1>Metoda PATCH</h1>
     * <h3>Confera functionalitatea uneia din cele 4 metode de PATCH din cadrul REST API-ului pe care
     * aplicatia le va utiliza in cadrul entitatilor de tip postare. Metoda primeste drept parametru un identificator unic
     * al unei astfel de entitati, pe care il va utiliza pentru a scadea valoarea field-ului dislikes, asociat numarului
     * de dislike-uri pe care un utilizator le poate primi la o postare incarcata, cat si un identificator al entitatii de
     * tip Account, aferente user-ului ce a efectuat cererea de crestere cu o unitate a dislike-urilor pentru postarea
     * respectiva. Prin intermediul ultimului parametru, se va actualiza campul dislikedBy (lista), al entitatii Post.</h3>
     *
     * @param postId    <b>identificatorul unic al postarii asupra careia se efectueaza cresterea numarului de dislike-uri</b>
     * @param accountId <b>identificatorul unic al contului ce a reactionat cu dislike postarii referentiate prin intermediul primului parametru.</b>
     * @return <b>Un Response Entity de tip Post ce va contine postarea modificata ca urmare a modificarii numarului de like-uri/dislike-uri.</b>
     */
    @PatchMapping("/increase-dislikes/{postIdentifier}/{accountIdentifier}")
    public ResponseEntity<Post> increaseDislikesCount(@PathVariable("postIdentifier") String postId,
                                                      @PathVariable("accountIdentifier") String accountId)
            throws ResourceNotFoundException {
        return postService.increaseDislikes(postId, accountId);
    }

    /*    *//*Metoda PATCH
    decreaseDislikesCount(): conferă funcționalitatea uneia din cele 4 metode de PATCH din cadrul REST API-ului pe care
    aplicația le va utiliza in cadrul entităților de tip postare. Metoda primește drept parametru un identificator unic
    al unei astfel de entității, pe care il va utiliza pentru a scădea valoarea field-ului dislikes, asociat numărului
    de dislike-uri pe care un utilizator le poate primi la o postare încărcată. *//*
    @PatchMapping("/decrease-dislikes/{postIdentifier}/{accountIdentifier}")
    public ResponseEntity<Post> decreaseDislikesCount(@PathVariable("postIdentifier") String postId,
                                                      @PathVariable("accountIdentifier") String accountId)
            throws ResourceNotFoundException {
        return postService.decreaseDislikes(postId, accountId);
    }*/

    /**
     * <h1>Metoda GET particularizata</h1>
     * <h3>O generalizare e metodei retrivePosts(), definita anterior.
     * Aceasta va returna o postare din lista tuturor acestor entitati stocate in baza de date, in functie de identificatorul sau.
     *
     * @param postId <b>Identificatorul unic al postarii in functie de care postarea dorita va fi cautata in baza de date a aplicatiei.</b>
     * @return <b>Entitatea de tipul Post cu id-ul specificat drept parametru</b>
     */
    @GetMapping("/{identifier}")
    public Post retrievePostById(@PathVariable("identifier") String postId) {
        return postService.getPostMetadataByIdentifier(postId);
    }

    /**
     * <h1>Metoda GET particularizata</h1>
     * <h3>Obtine identificatorii conturilor care au apreciat o postare identificata in baza unui anume identificator al postarii</h3>.
     *
     * @param postId <b>identificatorul unic al postarii pentru care se va genera lista utilizatorilor ce au dat like</b>
     * @return <b>Un set de Strings ce cuprinde o lista a tuturor identificatorilor unici aferenti conturilor de utilizator  ce au apreciat o anume postare.</b>
     */

    @GetMapping("/{identifier}/getLikes")
    public Set<String> retreiveAccountsWhoLiked(@PathVariable("identifier") String postId) {
        Post dummy = postService.getPostMetadataByIdentifier(postId);
        return dummy.getLikedBy();
    }

    /**
     * <h1>Metoda GET particularizata</h1>
     * <h3>Obtine identificatorii conturilor care au dat dislike unei postari identificate in baza unui anume identificator al postarii.</h3>
     *
     * @param postId <b>identificatorul unic al postarii pentru care se va genera lista utilizatorilor ce au dat dislike</b>
     * @return <b>Un set de Strings ce cuprinde o lista a tuturor identificatorilor unici aferenti conturilor de utilizator din cadrul aplicatiei ce au subapreciat postarea in cauza.</b>
     */
    @GetMapping("/{identifier}/getDislikes")
    public Set<String> retrieveAccountsWhoDisliked(@PathVariable("identifier") String postId) {
        Post dummy = postService.getPostMetadataByIdentifier(postId);
        return dummy.getDislikedBy();
    }

    /**
     * <h1>Metoda GET particularizata</h1>
     * <h3>Obtine toti utilizatorii (lista de usernames) ce au apreciat o postare specificata.</h3>
     *
     * @param postId <b>identificatorul unic al postarii pentru care se doreste obtinerea acestei liste de entitati</b>
     * @return <b>O lista de String-uri in care fiecare element este un nume de utilizator al celui ce a apreciat postarea in cauza.</b>
     */
    @GetMapping("/{identifier}/usersWhoLiked")
    public List<String> retrieveAllUsersThatLikedAPost(@PathVariable("identifier") String postId) {
        return postService.getAllUsersThatLikedAPost(postId);
    }

    /**
     * <h1>Metoda GET particularizata</h1>
     * <h3>Obtine toti utilizatorii (lista de usernames) ce au subapreciat o postare specificata.</h3>
     *
     * @param postId <b>identificatorul unic al postarii pentru care se doreste obtinerea acestei liste de entitati</b>
     * @return <b>O lista de String-uri in care fiecare element este un nume de utilizator al celui ce a subapreciat postarea in cauza.</b>
     */
    @GetMapping("/{identifier}/usersWhoDisliked")
    public List<String> retrieveAllUsersThatDislikedAPost(@PathVariable("identifier") String postId) {
        return postService.getAllUsersThatDislikedAPost(postId);
    }

    /**
     * <h1>Metoda GET</h1>
     * <h3>obtine o lista a tuturor fotografiilor de profil ale utilizatorilor ce au dat like unei anume postari.
     * (referinte externe ale acestora, catre Firebase) pentru utilizatorii ce au apreciat o postare, identificata pe baza
     * id-ului sau unic.
     * Aceasta metoda va fi utilizata pentru a permite actualizarea fotografiilor de profil din lista persoanelor ce au dat
     * like unei postari incarcate pe platforma</h3>
     *
     * @param postId <b>identificator unic postare</b>
     * @return <b>O lista de Strings ce va stoca toate referintele catre fotografiile de profil stocare in Firebase ale utilizatorilor ce au apreciat o postare.</b>
     */
    @GetMapping("/{identifier}/profilePictures/usersWhoLiked")
    public List<String> retrieveProfilePicturesOfUsersWhoLikedPost(@PathVariable("identifier") String postId) {
        return postService.getProfilePicturesForLikesSection(postId);
    }

    /**
     * <h1>Metoda GET</h1>
     * <h3>obtine o lista a tuturor fotografiilor de profil ale utilizatorilor ce au dat dislike unei anume postari.
     * (referinte externe ale acestora, catre Firebase) pentru utilizatorii ce au apreciat o postare, identificata pe baza
     * id-ului sau unic.
     * Aceasta metoda va fi utilizata pentru a permite actualizarea fotografiilor de profil din lista persoanelor ce au dat
     * like unei postari incarcate pe platforma</h3>
     *
     * @param postId <b>identificator unic postare</b>
     * @return <b>O lista de Strings ce va stoca toate referintele catre fotografiile de profil stocare in Firebase ale utilizatorilor ce au subapreciat o postare.</b>
     */
    @GetMapping("/{identifier}/profilePictures/usersWhoDisliked")
    public List<String> retrieveProfilePicturesOfUsersWhoDislikedPost(@PathVariable("identifier") String postId) {
        return postService.getProfilePicturesForDislikesSection(postId);
    }

    /**
     * <h1>Metoda DELETE</h1>
     * <h3>Permite eliminarea unei postari din baza de date si implicit, din feed-ul aplicatiei.</h3>
     *
     * @param postId <b>identificatorul unic al postarii ce va urma a fi eliminata</b>
     * @return <b>Un Response Entity de tipul Post in care se va stoca postarea ce tocmai a fost eliminata din aplicatie</b>
     */
    @Transactional
    @DeleteMapping("/delete/{identifier}")
    public ResponseEntity<Post> deletePost(@PathVariable("identifier") String postId) {
        return postService.deleteSpecificPost(postId);
    }

    /**
     * <h1>Metoda PATCH</h1>
     * <h3>Editeaza o anume postare, identificata in baza unui id</h3>
     *
     * @param postId  <b>identificatorul unic al postarii ce va urma a fi actualizata</b>
     * @param payload <b>Payload-ul PATCH Request-ului, o instanta a clasei auxiliare EditPostPayload ce retine informatii referitoare la campurile editabile din cadrul unei entitati de tipul postare (locatie, descriere postarre, timestamp actualizare).</b>
     * @return <b>Un Response Entity de tipul Post ce va retine entitatea de tip postare ce tocmai a fost modificata.</b>
     */
    @PatchMapping("/edit/{identifier}")
    public ResponseEntity<Post> editPost(@PathVariable("identifier") String postId,
                                         @RequestBody EditPostPayload payload) {
        return this.postService.update(postId, payload);
    }

    /**
     * <h1>Metoda PATCH</h1>
     * <h3>Modifica field-ul din baza de date cu numele post_owners_profile_picture, din tabela post, in momentul in care
     * owner-ul postarii in cauza  isi schimba fotografia de profil</h3>
     *
     * @param postId <b>identificator unic postare</b>
     * @return <b>Un Response Entity de tip postare ce va inmagazina postarea modificata (noua referinta a fotografiei de profil</b>
     */
    @PatchMapping("/edit-profile-picture/{identifier}")
    public ResponseEntity<Post> editOwnerProfilePictureForPost(@PathVariable("identifier") String postId) {
        return this.postService.updateProfilePictureField(postId);
    }
}

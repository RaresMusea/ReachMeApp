package com.reachme.service;

import com.reachme.entity.Account;
import com.reachme.entity.Post;
import com.reachme.misc.EditPostPayload;
import com.reachme.repo.IPostRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * <h1>Clasa PostService</h1>
 * <h3>Implementeaza serviciul ce permite utilizarea metodelor din cadrul acestui REST API, specifice pentru obtinerea, respectiv adaugarea de noi postari in feed-ul retelei de socializare</h3>
 * <h3>Pentru a putea updata in timp real baza de date, serviciul curent integreaza o instanta a interfetei IPostRepository, prin intermediul injectiei de dependinta.</h3>
 * <h3>Integrarea interfetei in cadrul serviciului va permite accesul la toate metodele de scriere/citire/editare in baza de date din cadrul interfetei pe care repository-ul o mosteneste</h3>
 */

@Service
public class PostService {

    /**
     * <b>Instanta a interfetei IPostRepository, ce va fi utilizata in vederea apelarii tuturor metodelor definite in interfata JpaRepository.</b>
     */
    private final IPostRepository postRepository;

    /**
     * <b>Instanta a entitatii AccountService, ce va fi utilizata in vederea comunicarii dintre microservicii in cadrul request-urilor (entitatea Post este strans legata de entitatea Account).</b>
     */
    private final AccountService accountService;

    /**
     * <h1>Constructorii serviciului PostService</h1>
     * <h3>Constructor de initializare, utilizeaza injectia de dependinta in vederea initializarii celor 2 campuri anterior declarate, ce vor fi utilizate in vederea asigurarii comunicarii dintre microservicii in cadrul aplicatiei.</h3>
     *
     * @param postRepository <b>instanta a interfetei IPostRepository, permite accesarea tuturor metodelor de scriere/citire/editare/stergere din baza de date a entitatilor de tip postare din cadrul aplicatiei.</b>
     * @param accountService <b>instanta a clasei accountService ce va permite apelul unor metode din cadrul acestei clase in vederea asigurarii unei comunicari cat mai eficiente intre AccountService si, respectiv PostService.</b>
     */
    public PostService(IPostRepository postRepository, AccountService accountService) {
        this.postRepository = postRepository;
        this.accountService = accountService;
    }

    /**
     * <b> Permite obtinerea, sub forma unei colectii de tip lista, a tuturor postarilor
     * inregistrate in baza de date a aplicatiei.</b><br/>
     * <b>
     * Metoda va fi mai apoi apelata din cadrul clasei PostController, in vederea implementarii facilitatii metodei de
     * GET efectuate la nivel de http request asupra unei entitati de tip Post.</b>
     *
     * @return <b>O colectie de tip lista ce va contine toate entitatile de tip postare existente, la momentul invocarii in cadrul bazei de date a aplicatiei.</b>
     */
    public List<Post> getPostsMetadata() {

        //Pentru a putea obtine numele user-ului ce a incarcat postarea, pe baza identifier-ului sau, care cumva realizeaza
        //o legatura intre entitatea Account si entitatea user, vom folosi un REST Template pentru a putea asigura comunicarea
        //intre cele 2 microservicii.

        List<Post> posts = postRepository.findAll();
        RestTemplate template = new RestTemplate();

        //Iterare prin lambda expression
        posts.forEach(post -> {
            String route = "http://localhost:8080/account/{identifier}";

            //Obtinem identifier-ul contului din entitatea pe care serviciul curent o administreaza (Post).
            String id = post.getAccountIdentifier();

            //Apelam metoda GET pentru entitatea Account pentru a obtine obiectul de tip Account in care s-au retinut informatii despre
            //utilizatorul cu id-ul specificat.
            Account match = template.getForObject(route, Account.class, id);

            //In final, setam numele de utilizator pentru postarea curenta ca fiind chiar utilizatorul pentru care cele 2 campuri-identifier corespund.
            post.setPostOwner(match.getUserName());
        });
        posts.sort((a, b) -> b.getIdentifier() - a.getIdentifier());
        return posts;
    }

    /**
     * <b>Metoda responsabila de trimiterea catre baza de date a metadatelor referitoare la o noua entitate de tip Post. Metoda  apeleaza metoda save(), din interfata JpaRepository, pe care repository-ul
     * IPostRepository o mosteneste.</b><br/><br/>
     * <b>
     * Apelul metodei save() are ca efect salvarea payload-ului transmis ca si parametru metodei in baza de date a aplicatiei.
     * Metoda va fi apelata in final din cadrul Controller-ului, in vederea asigurarii functionalitatii metodei de POST
     * din REST API-ul pe care il vom integra in cadrul aplicatiei web.</b>
     *
     * @param p <b>payload-ul request-ului de tip POST, ce va contine datele referitoare la noua postare ce va urma a fi introdusa in baza de date a aplicatiei</b>
     * @return <b>o instanta a entitatii Post ce va contine datele postarii ce tocmai a fost inserata in cadrul bazei de date a aplicatiei.</b>
     */
    public Post sendPostMetadata(Post p) {
        return postRepository.save(p);
    }


    /**
     * <b>Metoda responsabila de cresterea numarului de like-uri in cadrul unei postari, sau eliminarea dislike-ului, in cazul in care postarea a fost mai intai subapreciata si ulterior, apreciata.</b><br/>
     * <b>Metoda apeleaza rutinele findByPostIdentifier(), respectiv save() din interfata JpaRepository, pe care
     * repo-ul IPostRepository o mosteneste.</b><br/><br/>
     * <b>Apelul metodei findByPostIdentifier permite obtinerea unei postari, dupa un identificator specificat.</b><br/><br/>
     * <b>Se va efectua cresterea cu o unitate a field-ului likes pentru instanta entitatii identificate in baza id-ului specificat,
     * cat si modificarea listei likedBy din cadrul aceleiasi entitati, prin adaugarea identificatorului entitatii de tip
     * Account care a apreciat postarea respectiva, dupa care se va realiza salvarea in baza de date a intrarii modificate,
     * prin intermediul metodei save().</b><br/><br/>
     * <b>Prin urmare, metoda permite utilizatorilor sa aprecieze postarea/postarile proprii/ale celorlalti utilizatori din
     * cadrul aplicatiei.</b><br/><br/>
     *
     * @param postIdentifier    <b>identificatorul postarii apreciate</b>
     * @param accountIdentifier <b>identificatorul contului ce apreciaza postarea</b>
     * @return <b>un ResponseEntity de tipul Post ce va contine postarea ce a suferit o modificare in privinva likes count-ului</b>
     */
    public ResponseEntity<Post> increaseLikes(String postIdentifier, String accountIdentifier) {
        Post post = postRepository.findByPostIdentifier(postIdentifier);
        Account account = accountService.retrieveAccountMetadata(accountIdentifier);
        if (post.getLikedBy().contains(accountIdentifier)) {
            Set<String> temp = post.getLikedBy();
            temp.remove(accountIdentifier);
            post.setLikedBy(temp);
            post.setLikes(post.getLikes() == 0 ? post.getLikes() : post.getLikes() - 1);
        } else {

            if (post.getDislikedBy().contains(accountIdentifier)) {
                Set<String> temp = post.getDislikedBy();
                temp.remove(accountIdentifier);
                post.setDislikedBy(temp);
                post.setDislikes(post.getDislikes() == 0 ? post.getDislikes() : post.getDislikes() - 1);
            }
            post.setLikes(post.getLikes() + 1);
            post.addLike(accountIdentifier);
        }
        final Post partiallyUpdatedPost = postRepository.save(post);
        return ResponseEntity.ok(partiallyUpdatedPost);
    }

    /**
     * <b>Metoda responsabila de cresterea numarului de dislike-uri din cadrul unei postari, respectiv de scadere a numarului de like-uri in situatia in care postarea ce primeste dislike era inainte apreciata de utilizatorul ce tocmai a apreciat-o</b><br/><br/>
     * <b>Aceasta  apeleaza metodele findByPostIdentifier(), respectiv save() din interfata JpaRepository, pe care
     * repo-ul IPostRepository o mosteneste.</b><br/><br/>
     * <b>Apelul metodei findByPostIdentifier permite obtinerea unei postari, dupa un identificator specificat.</b>
     * <b>Se va efectua cresterea cu o unitate a field-ului dislikes, pentru instanta
     * entitatii identificate in baza id-ului specificat, se va actualiza field-ul dislikedBy din cadrul entitatii cu identificatorul
     * user-ului ce a oferit un dislike la postarea in cauza. dupa care se va realiza salvarea in baza de date a entitatii deja modificate,
     * prin intermediul metodei save().</b></b>
     * <b>
     * Prin urmare, metoda permite utilizatorilor finali sa ofere dislike-uri pentru postarea/postarile
     * proprii/ale celorlalti utilizatori din cadrul aplicatiei.</b><br/><br/>
     *
     * @param postIdentifier    <b>identificatorul postarii ce primeste subaprecierea</b>
     * @param accountIdentifier <b>identificatorul contului ce reactioneaza cu dislike la postarea identificata.</b>
     * @return <b>un ResponseEntity de tipul Post, ce va contine postarea ce a suferit o modificare asupra dislikes count-ului</b>
     */

    public ResponseEntity<Post> increaseDislikes(String postIdentifier, String accountIdentifier) {
        Post post = postRepository.findByPostIdentifier(postIdentifier);
        Account account = accountService.retrieveAccountMetadata(accountIdentifier);

        if (post.getDislikedBy().contains(accountIdentifier)) {
            Set<String> temp = post.getDislikedBy();
            temp.remove(accountIdentifier);
            post.setDislikedBy(temp);
            post.setDislikes(post.getDislikes() == 0 ? post.getDislikes() : post.getDislikes() - 1);
        } else {

            if (post.getLikedBy().contains(accountIdentifier)) {
                Set<String> temp = post.getLikedBy();
                temp.remove(accountIdentifier);
                post.setLikedBy(temp);
                post.setLikes(post.getLikes() != 0 ? post.getLikes() - 1 : post.getLikes());
            }
            post.setDislikes(post.getDislikes() + 1);
            post.addDislike(accountIdentifier);
        }
        final Post partiallyUpdatedPost = postRepository.save(post);
        return ResponseEntity.ok(partiallyUpdatedPost);
    }

    /* Apelul metodei findByPostIdentifier() permite obtinerea unei postari, dupa un identificator specificat.
    Se va efectua scaderea cu o unitate a field-ului dislikes (in situatia in care acesta este nenul) pentru instanta
    entitatii identificate in baza id-ului specificat, se va elimina din colectia dislikedBy identificatorul utilizatorului
    ce tocmai a revocat dislike-ul in cadrul postarii respective, dupa care se va realiza salvarea in baza de date a entitatii deja modificate,
    prin intermediul metodei save().
    Prin urmare, metoda permite utilizatorilor finali sa ofere dislike-uri pentru postarea/postarile
    proprii/ale celorlalti utilizatori din cadrul aplicatiei. */

    /*public ResponseEntity<Post> decreaseDislikes(String postIdentifier, String accountIdentifier) {
        Post post = postRepository.findByPostIdentifier(postIdentifier);
        Account account = accountService.retrieveAccountMetadata(accountIdentifier);

        post.setDislikes(post.getDislikes() == 0 ? post.getDislikes() : post.getDislikes() - 1);
        if (post.getDislikes() != 0) {
            post.removeDislike(accountIdentifier);
        }
        final Post partiallyUpdatedPost = postRepository.save(post);
        return ResponseEntity.ok(partiallyUpdatedPost);
    }*/

    /**
     * <b>Metoda ce obtine o postare in baza identificatorului sau unic.</b><br/><br/>
     * <b>Metoda cauta in baza de date, cu ajutorul metodei findByPostIdentifier(), definita
     * in cadrul interfetei IPostRepository, o anume postare dupa un identificator unic si o returneaza.</b><br/><br/>
     * <b>Aceasta metoda getPostMedatadaByIdentifier(), va fi in final apelata din controller-ul entitatii, in vederea asigurarii
     * functionalitatii unei metode HTTP de tip GET particularizata.</b><br/><br/>
     *
     * @param postIdentifier <b>identificatorul unic al postarii ce va urma a fi cautata in baza de date</b>
     * @return <b>o entitate de tip Post aferenta postarii gasite</b>
     */

    public Post getPostMetadataByIdentifier(String postIdentifier) {
        RestTemplate template = new RestTemplate();

        Post post = postRepository.findByPostIdentifier(postIdentifier);
        String endpoint = "http://localhost:8080/account/{identifier}";

        String accountIdentifier = post.getAccountIdentifier();

        //Apelam metoda GET pentru entitatea Account pentru a obtine obiectul de tip Account in care s-au retinut informatii despre
        //utilizatorul cu id-ul specificat.
        Account match = template.getForObject(endpoint, Account.class, accountIdentifier);

        //In final, setam numele de utilizator pentru postarea curenta ca fiind chiar utilizatorul pentru care cele 2 campuri-identifier corespund.
        post.setPostOwner(match.getUserName());

        return post;
    }

    /**
     * <b>Metoda responsabila de obtinerea tuturor utilizatorilor (sub forma de username) ce au apreciat o postare specifica.</b><br/><br/>
     * <b>Rezultatul final va fi returnat sub forma unui Array List</b>
     *
     * @param postIdentifier <b>identificatorul unic al postarii ce va urma a fi interogata in vederea obtinerii rezultatului.</b>
     * @return <b>o colectie de tip ArrayList a tuturor numelor de utilizator ce descriu utilizatorii care au apreciat postarea specificata.</b>
     */
    public List<String> getAllUsersThatLikedAPost(String postIdentifier) {
        Post aux = getPostMetadataByIdentifier(postIdentifier);
        Set<String> accountsIdentifiers = aux.getLikedBy();
        if (accountsIdentifiers.isEmpty()) {
            return new ArrayList<>();
        }
        RestTemplate restTemplate = new RestTemplate();
        String path = "http://localhost:8080/account/{identifier}";
        List<String> result = new ArrayList<>();

        accountsIdentifiers.forEach(identifier -> {
            Account acc = restTemplate.getForObject(path, Account.class, identifier);
            result.add(acc.getUserName());
        });
        return result;
    }

    /**
     * <b>Metoda responsabila de obtinerea tuturor utilizatorilor (sub forma de username) ce au subapreciat o postare specifica.</b><br/><br/>
     * <b>Rezultatul final va fi returnat sub forma unui Array List</b>
     *
     * @param postIdentifier <b>identificatorul unic al postarii ce va urma a fi interogata in vederea obtinerii rezultatului.</b>
     * @return <b>o colectie de tip ArrayList a tuturor numelor de utilizator ce descriu conturile din cadrul aplicatiei care au subapreciat postarea specificata.</b>
     */
    public List<String> getAllUsersThatDislikedAPost(String postIdentifier) {
        Post aux = getPostMetadataByIdentifier(postIdentifier);
        Set<String> identifiers = aux.getDislikedBy();

        if (identifiers.isEmpty()) {
            return new ArrayList<>();
        }
        RestTemplate restTemplate = new RestTemplate();
        String path = "http://localhost:8080/account/{identifier}";
        List<String> result = new ArrayList<>();
        identifiers.forEach(identifier -> {
            Account acc = restTemplate.getForObject(path, Account.class, identifier);
            result.add(acc.getUserName());
        });
        return result;
    }

    /**
     * <b>Obtine o lista a legaturilor externe din Firebase ce conduc catre fotografiile de profil ale utilizatorilor ce au apreciat o postare.</b><br/><br/>
     * <b>Aceata rutina va fi utilizata in cadrul aplicatiei, in vederea afisarii pentru lista de like-uri, a pozei de profil specifice fiecarui utilzator care au apreciat o anumita postare.</b><br/><br/>
     *
     * @param postIdentifier <b>identificatorul postarii pentru care se doreste obtinerea acestor URL-uri.</b>
     * @return <b>o colectie de tip lista a tuturor acestor referinte, ce ulterior vor fi utilizate in cadrul frontend-ului aplicatiei, in vederea implementarii elementelor de inferfata grafica.</b>
     */
    public List<String> getProfilePicturesForLikesSection(String postIdentifier) {
        Post aux = getPostMetadataByIdentifier(postIdentifier);
        Set<String> likesIdentifiers = aux.getLikedBy();

        if (likesIdentifiers.isEmpty())
            return new ArrayList<>();

        RestTemplate template = new RestTemplate();
        String endpoint = "http://localhost:8080/account/{identifier}";
        List<String> results = new ArrayList<>();
        likesIdentifiers.forEach(identifier -> {
            Account acc = template.getForObject(endpoint, Account.class, identifier);
            assert acc != null;
            if (!acc.getProfilePhotoHref().equals(""))
                results.add(acc.getProfilePhotoHref());
            else
                results.add("");
        });
        return results;
    }

    /**
     * <b>Obtine o lista a legaturilor externe din Firebase ce conduc catre fotografiile de profil ale utilizatorilor ce au subapreciat o postare.</b><br/><br/>
     * <b>Aceata rutina va fi utilizata in cadrul aplicatiei, in vederea afisarii pentru lista de dislike-uri, a pozei de profil specifice fiecarui utilzator care a subapreciat o anumita postare.</b><br/><br/>
     *
     * @param postIdentifier <b>identificatorul postarii pentru care se doreste obtinerea acestor URL-uri.</b>
     * @return <b>o colectie de tip lista a tuturor acestor referinte, ce ulterior vor fi utilizate in cadrul frontend-ului aplicatiei, in vederea implementarii elementelor de inferfata grafica.</b>
     */
    public List<String> getProfilePicturesForDislikesSection(String postIdentifier) {

        RestTemplate rest = new RestTemplate();
        Post temp = getPostMetadataByIdentifier(postIdentifier);
        Set<String> dislikesIdentifiers = temp.getDislikedBy();

        if (dislikesIdentifiers.isEmpty())
            return new ArrayList<>();

        String route = "http://localhost:8080/account/{identifier}";
        List<String> res = new ArrayList<>();

        dislikesIdentifiers.forEach(dislike -> {
            Account account = rest.getForObject(route, Account.class, dislike);
            assert account != null;
            if (!account.getProfilePhotoHref().equals(""))
                res.add(account.getProfilePhotoHref());
            else
                res.add("");
        });
        return res;
    }

    /**
     * <b>Metoda responsabila de stergerea din baza de date a unei postari, identificate in baza identificatorului sau unic.</b>
     *
     * @param postIdentifier <b>identificatorul postarii</b>
     * @return <b>un ResponseEntity de tipul Post in care se va returna postarea ce tocmai a fost eliminata din baza de date a aplicatiei.</b>
     */
    public ResponseEntity<Post> deleteSpecificPost(String postIdentifier) {

        Integer removed = postRepository.deletePostByPostIdentifier(postIdentifier);
        if (removed == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * <b>Permite editarea continutului unei postari, prin editarea descrierii, a locatiei, cat si a datei ultimei editari.</b><br/><br/>
     *
     * @param postId  <b>identificator unic postare</b>
     * @param payload <b>payload-ul patch-ului, o instanta a clasei EditPostPayload ce contine doar field-urile din cadrul unei postari ce pot fi editate in baza unui PATCH request.</b>
     * @return <b>un ResponseEntity de tip Post ce va returna noua postare, obtinuta in urma modificarilor efectuate de metoda PATCH.</b>
     */
    public ResponseEntity<Post> update(String postId, EditPostPayload payload) {
        Post current = postRepository.findByPostIdentifier(postId);
        current.setPostDescription(payload.getDescription());
        current.setLocation(payload.getLocation());
        current.setTimestamp(payload.getTimestamp());

        final Post editedPost = postRepository.save(current);
        return ResponseEntity.ok(editedPost);
    }

    /**
     * <b>Updateaza campul onwerProfilePicture din tabela SQL aferenta postarilor, in momentul in care owner-ul unei postari
     * isi schimba fotografia de profil.</b><br/><br/>
     * <b>Acest aspect permite actualizarea in timp real a icon-ului fotografiei de profil a utilizatorului ce isi modifica fotografia de profil si in cadrul entitatilor de tip Post uploadate, pe langa avatar-ul din sectiunea de Info, ce va fi in mod automat actualizata la schimbarea fotografiei de profil. </b><br/><br/>
     *
     * @param postId <b>identificator unic postare</b>
     * @return <b>un responseEntity de tipul postare ce va contine body-ul in format .JSON a entitatii de tip postare ce tocmai a suferit o modificare</b>
     */

    public ResponseEntity<Post> updateProfilePictureField(String postId) {
        Post post = postRepository.findByPostIdentifier(postId);
        RestTemplate restTemplate = new RestTemplate();

        String endpoint = "http://localhost:8080/account/{identifier}";
        String accountIdentifier = post.getAccountIdentifier();

        String profilePictureHref = restTemplate.getForObject(endpoint, Account.class, accountIdentifier).getProfilePhotoHref();
        post.setPostOwnersProfilePicture(profilePictureHref);

        final Post modifiedPost = postRepository.save(post);
        return ResponseEntity.ok(modifiedPost);
    }
}

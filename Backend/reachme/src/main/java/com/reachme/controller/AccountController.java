package com.reachme.controller;

import com.reachme.entity.Account;
import com.reachme.service.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <h1>Clasa AccountController</h1>
 *
 * <h3>Controller REST ce va fi utilizat pentru implementarea la nivel de baza a request-urilor din cadrul aplicatiei ce vor
 * fi executate asupra entitatilor de tipul cont de utilizator.</h3>
 *
 * <h3>Toate metodele necesare pentru realizarea acestor request-uri vor fi definite si implementate in cadrul acestei clase.</h3>
 *
 * <h3>Prin intermediul endpoint-ului /account, respectiv /account{id}, utilizatorul va putea adauga crea
 * si vizualiza detalii despre conturile personale</h3>
 *
 * <h3>In vederea stabilirii unei conexiuni intre aplicatie si baza de date mySQL, cele 2 metode implementate vor utiliza un
 * serviciu (instanta a clasei StoryService) care in cadrul clasei a fost adaugat prin intermediul
 * injectiei de dependinta (Dependency Injection).</h3>
 *
 * <h3>Crearea/Obtinerea din serviciu a datelor referitoare la conturile de utilizator, sau actualizarea bazei de date cu noi astfel de entitati va fi realizabila doar
 * prin implementarea unei interfete de tip Repository care sa mosteneasca o alta astfel de interfata, care sa contina cel
 * putin o metoda de adaugare si una de obtinere a acestor informatii.</h3>
 *
 * <h3>Instanta interfetei IStoryRepository va putea fi integrata in cadrul serviciului, tot prin intermediul
 * injectiei de dependinta.</h3>
 */

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/account")
public class AccountController {

    /**
     * <p><b>O instanta a clasei accountService utilizata in vederea utilizarii metodelor aferente acelei clase. Instantierea va fi realizata prin injectie de dependinta.</b></p>
     */
    private final AccountService accountService;

    /**
     * <h1>Constructor de initializare</h1>
     *
     * @param accountService <b>Instanta a clasei AccountService, serviciu al REST API-ului ce va fi utilizat in vederea asigurarii functionalitatii request-urilor.</b>
     */
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    /**
     * <h1>Metoda POST</h1>
     * Confera functionalitatea metodei POST din cadrul REST API-ului pe care aplicatia fullstack il va
     * integra. Metoda primeste drept parametru de intrare o referinta (instanta) a clasei Account, pe care o va trimite
     * mai departe catre server.
     * <p>
     * In vederea trimiterii catre baza de date a datelor unui utilizator, metoda va folosi o instanta a serviciului
     * AccountService, mai exact metoda sendAccount().
     */
    @PostMapping("")
    private Account sendAccount(@RequestBody Account profile) {
        return accountService.sendMetadata(profile);
    }

    /**
     * <h1>Metoda GET</h1>
     * <h3>Confera functionalitatea metodei GET din cadrul REST API-ului pe care aplicatia fullstack il
     * va integra. Metoda primeste drept parametru de input un String ce va constitui id-ul unic cu ajutorul caruia se va
     * returna un anume utilizator, identificat in baza acestui criteriu.</h3><br/>
     *
     * <h3>In vederea obtinerii datelor unui anume utilizator din baza de date, metoda va utiliza o instanta a serviciului
     * AccountService, respectiv metoda retrieveAccountMetadata().</h3>
     *
     * @param accountId <b>Identificatorul unic al contului asupra caruia se va face ulterior retrieve.</b>
     * @return <b>O instanta a clasei-entitate Account</b>
     */
    @CrossOrigin(origins = "http://localhost:8080")
    @GetMapping("/{accountFirebaseIdentifier}")
    private Account getAccountDetails(@PathVariable("accountFirebaseIdentifier") String accountId) {
        return accountService.retrieveAccountMetadata(accountId);
    }

    /**
     * <h1>Metoda PATCH</h1>
     * <h3>Confera functionalitatea metodei PATCH din cadrul REST API-ului pe care aplicatia fullstack il va integra.
     * Metoda primeste drept parametru un String ce constituie identificatorul unic al unui cont de utilizator, pentru care se va efectua modificarea
     * fotografiei de profil.</h3>
     * <br/>
     *
     * @param accountId            <b>identificatorul contului pentru care se doreste efectuarea modificarii in baza de date</b>
     *                             <br/>
     * @param newProfilePictureRef <b>path(URL) catre o noua referinta a unei noi fotografii sau fisier media ce va inlocui fotografia de profil deja existenta.</b>
     *                             <br/>
     * @return <b>O referinta a entitatii deja modificate</b>.
     */

    @PatchMapping("/{identifier}/ChangeProfilePicture")
    public ResponseEntity<Account> changeAccountProfilePicture(@PathVariable("identifier") String accountId, @RequestBody String newProfilePictureRef) {
        return accountService.editProfilePictureForUser(accountId, newProfilePictureRef);
    }

    /**
     * <h1>Metoda PATCH</h1>
     * <h3>Schimba adresa de email asociata unui cont.</h3><br/>
     *
     * @param accountId       <b>identificatorul unic al contului</b>
     *                        <br/>
     * @param newEmailAddress <b>payload HTTP Request, noua adresa de email</b><br/>
     * @return <b>O referinta a entitatii obtinute in urma modificarilor efectuate</b>
     */
    @PatchMapping("/changeEmail/{identifier}")
    private ResponseEntity<Account> changeEmailAddress(@PathVariable("identifier") String accountId, @RequestBody String newEmailAddress) {
        return accountService.changeEmailAddress(accountId, newEmailAddress);
    }

    /**
     * <h1>Metoda GET particularizata</h1>
     * <h3>Apeleaza metoda getAllAccounts din serviciul entitatii in vederea obtinerii unei liste a tuturor conturilor de
     * utilizator inregistrate in cadrul aplicatiei.</h3>
     *
     * @return <b>O lista a tuturor entitatilor de tipul Account inregistrate in baza de date mySQL a aplicatiei.</b>
     */
    @GetMapping("/all")
    private List<Account> retrieveAllAccounts() {
        return accountService.getAllAccounts();
    }
}

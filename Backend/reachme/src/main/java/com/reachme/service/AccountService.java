package com.reachme.service;

import com.reachme.entity.Account;
import com.reachme.repo.IAccountRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <h1>Clasa AccountService</h1>
 * <h3>implementeaza serviciul ce permite utilizarea metodelor REST API specifice, pentru obtinerea, respectiv adaugarea de noi conturi de utilizator in aplicatie.</h3>
 * <h3>Pentru a putea updata in timp real baza de date, serviciul curent integreaza o instanta a interfetei IPostRepository, prin intermediul injectiei de dependinta.</h3>
 * <h3>Integrarea interfetei in cadrul serviciului va permite accesul la toate metodele de scriere/citire/editare din cadrul interfetei pe care repository-ul o mosteneste.</h3>
 */

@Service
public class AccountService {

    /**
     * <b>Instanta a interfetei IAccountRepository, ce va fi initializata prin injectie de dependinta</b>
     */
    private final IAccountRepository accountRepository;


    /**
     * <h1>Constructorii serviciului Account Service</h1>
     * <h3>Constructor de initializare, utilizeaza injectia de dependinta pentru a initializa cele 2 repository-uri</h3>
     *
     * @param accountRepository <b>instanta a repository-ului responsabil de gestionarea entitatilor de tip cont de utilizator</b>
     */
    public AccountService(IAccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }


    /**<b>Metoda responsabila de obținerea sub forma de metadata a informațiilor referitoare la un anume cont de utilizator
    din baza de date, identificat prin intermediul unui identificator, pasat ca si parametru de intrare.</b>
     @param accountIdentifier <b>identificatorul unic al unui cont de utilizator</b>
     @return <b>o instanta a entitatii Account ce descrie contul identificat in baza identificatorului specificat.</b> */
    public Account retrieveAccountMetadata(String accountIdentifier) {
        return accountRepository.findByaccountFirebaseIdentifier(accountIdentifier);
    }

    /**
     * <b>Trimite catre baza de date noile campuri specifice unui nou cont de utilizator in momentul crearii acestuia in aplicatie, la autentificare</b>
     *
     * @param ac <b>instanta a entitatii Account in care va constitui si body-ul payload-ului specific request-ului de POST la nivel de cont de utilizator.</b>
     */
    public Account sendMetadata(Account ac) {
        return accountRepository.save(ac);
    }

    /**
     * <b>Permite schimbarea fotografiei de profil asociata unui cont de utilizator</b>
     *
     * @param accountIdentifier    <b>identificatorul unic al contului de utilizator pentru care se va efectua aceasta modificare</b>
     * @param newProfilePictureURL <b>referinta (adresa URL catre Firebase Storage) a noii fotografii de profil specifice contului</b>
     * @return <b>o instanta a clasei ResponseEntity ce va contine entitatea de tip Account ce tocmai a suferit modificarea (schimbarea fotografiei de profil a contului).</b>
     */
    public ResponseEntity<Account> editProfilePictureForUser(String accountIdentifier, String newProfilePictureURL) {
        Account account = accountRepository.findByaccountFirebaseIdentifier(accountIdentifier);
        account.setProfilePhotoHref(newProfilePictureURL);
        final Account patched = accountRepository.save(account);
        return ResponseEntity.ok(patched);
    }

    /**
     * <b>Schimba adresa de email a unui utilizator, printr-un HTTP PATCH</b>
     *
     * @param identifier <b>Un sir de caractere ce reprezinta si identificatorul unic al contului de utilizator pentru care se doreste modificarea adresei de email</b>
     * @param newAddress <b>Un sir de caractere cu payload-ul request-ului (noua adresa de email cu care cea veche va fi inlocuita</b>
     * @return <b>o instanta a clasei ResponseEntity ce va contine entitatea de tip Account ce tocmai a suferit modificarea (schimbarea adresei de email.</b>
     */
    public ResponseEntity<Account> changeEmailAddress(String identifier, String newAddress) {
        Account foundAccount = accountRepository.findByaccountFirebaseIdentifier(identifier);
        foundAccount.setEmailAddress(newAddress);
        final Account edited = accountRepository.save(foundAccount);
        return ResponseEntity.ok(edited);
    }

    /**
     * <b>Obtine o lista a tuturor conturilor de utilizator prezente in cadrul bazei de date a aplicatiei</b>
     *
     * @return <b>o lista de entitati Account, ce va contine lista tuturor entitatilor de tip Account inregistrate in cadrul aplicatiei la momentul invocarii metodei.</b>
     */
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }


}

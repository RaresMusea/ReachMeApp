package com.reachme.repo;

import com.reachme.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**<h1>Interfata IAccountRepository</h1>
*<h3>Contine toate definitiile necesare pentru incarcarea si, respectiv obtinerea unui utilizator al aplicatiei, direct
din baza de date. Apelul acestor metode va fi realizat direct din clasa-serviciu (AccountService).</h3>
 <h3>O mare parte din metodele disponibile sunt preluate din interfata de tip repository JpaRespository, specifica Spring Boot.</h3>*/
@Repository
public interface IAccountRepository extends JpaRepository<Account, Integer> {

    /**<b>Metoda responsabila de gasirea unui cont in functie de identificatorul unic al acestuia</b><br/><br/>
     *
     * @param accountIdentifier <b>identificatorul unic al contului de utilizator cautat</b>
     * @return <b>contul de utilizator identificat in baza identificatorului specificat</b>
     */
    Account findByaccountFirebaseIdentifier(String accountIdentifier);
}

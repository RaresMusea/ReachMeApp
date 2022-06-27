package com.reachme.service;

import com.reachme.entity.Account;
import com.reachme.entity.Story;
import com.reachme.repo.IStoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

/**
 * <h1>Clasa StoryService</h1>
 * <h3>Implementeaza serviciul ce permite utilizarea metodelor REST API specifice, pentru obtinerea, respectiv adaugarea de noi story-uri in feed-ul retelei de socializare.</h3>
 * <h3>Pentru a putea updata in timp real baza de date, serviciul curent integreaza o instanta a interfetei IStoryRepository, prin intermediul injectiei de dependinta.</h3>
 * <h3>Integrarea interfetei in cadrul serviciului va permite accesul la toate metodele de scriere/citire/editare din cadrul interfetei pe care repository-ul o mosteneste.</h3>
 */

@Service
public class StoryService {

    /**<b>Utilizarea unei instante a interfetei IStoryRepository in vederea accesarii tuturor metodelor ce pot permite manipularea bazei de date.</b>*/
    private final IStoryRepository storyRepository;

    /**<h1>Constructori clasa StoryService</h1>
     * <b>Constructor de initializare, utilizeaza injectia de dependinta in vederea initializarii instantei interfetei IStoryRepository</b>
     * @param storyRepository <b>instanta a repository-ului de tip IStoryRepository</b>
     */
    public StoryService(IStoryRepository storyRepository) {
        this.storyRepository = storyRepository;
    }

    /**<b>Metoda ce permite obtinerea, sub forma unei colectii de tip lista, a tuturor povestilor
    inregistrate in baza de date a aplicatiei.</b><br/><br/>
    <b>Metoda va fi mai apoi apelata in cadrul clasei StoryController, in vederea implementarii facilitatii metodei de
    GET efectuate la nivel de http request asupra unei entitati de tip Story.</b>
     @return <b>o lista de entitati Story in care se vor stoca toate povestile existente, la momentul invocarii metodei in cadrul bazei de date a aplicatiei.</b>*/

    public List<Story> getStoriesMetadata() {

        //Folosim un rest template pentru a putea accesa date aferente entitatii Account (date din alta tabela sql)
        RestTemplate restTemplate = new RestTemplate();

        //Identificam toate povestile
        List<Story> stories = storyRepository.findAll();

        //Comunicare intre 2 microservicii:

        //Pentru fiecare poveste ce va fi afisata pentru utilizatorul in cauza, se va apela metoda get specifica entitatii
        //Account, pentru a putea obtine, sub forma unei instante a entitatii obiectul in care vom putea gasi si username-ul persoanei ce a postat acel story
        stories.forEach(story -> {

            String route = "http://localhost:8080/account/{identifier}";
            String id = story.getAccountIdentifier();

            //Apel metoda GET pentru conturi de utilizator
            Account current = restTemplate.getForObject(route, Account.class, id);
            //Utilizam setter-ul din entitatea Story pentru a defini owner-u;
            story.setOwner(current.getUserName());
        });
        //La final, returnam lista povestilor pentru user-ul curent
        return stories;
    }

    /**<b>Metoda responsabila de trimiterea catre baza de date a unei noi entitati de tip poveste(Story).</b><br/><br/>
     *<b>Metoda apeleaza rutina save(), din interfata JpaRepository, pe care repository-ul
    IStoryRepository o mosteneste.</b><br/><br/>

    <b>Apelul metodei save() are ca efect salvarea payload-ului transmis ca si parametru metodei in baza de date a aplicatiei.</b><br/><br/>
    <b>
    Metoda va fi apelata in final din cadrul Controller-ului, in vederea asigurarii functionalitatii metodei de POST
    din REST API-ul pe care il vom integra peste aplicatia web.</b><br/><br/>
     @param str <b>payload-ul request-ului, o entitate de tip Story ce ulterior va fi salvata(inserata) in baza de data MySQL a aplicatiei</b>
     @return <b>entitatea de tip Story salvata in baza de date.</b>*/
    public Story sendStoryMetadata(Story str) {
        return storyRepository.save(str);
    }
}

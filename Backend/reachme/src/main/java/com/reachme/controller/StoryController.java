package com.reachme.controller;


import com.reachme.entity.Story;
import com.reachme.service.StoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <h1>Clasa StoryController</h1>
 *
 * <h3>Controller REST ce va fi utilizat pentru implementarea la nivel de baza a request-urilor din cadrul aplicatiei ce vor
 * fi executate asupra entitatilor de tipul poveste (ReachMe Stories).</h3>
 *
 * <h3>Toate metodele necesare pentru realizarea acestor request-uri vor fi definite si implementate in cadrul acestei clase.</h3>
 *
 * <h3>Prin intermediul endpoint-ului /story, utilizatorul va putea posta story-uri, sau va putea obtine lista tuturor
 * story-urilor incarcate de persoanele cu care acesta se afla in contact.</h3>
 *
 * <h3>In vederea stabilirii unei conexiuni intre aplicatie si baza de date mySQL, cele 2 metode implementate vor utiliza un
 * serviciu (instanta a clasei StoryService) care in cadrul clasei a fost adaugat prin intermediul
 * injectiei de dependinta (Dependency Injection).</h3>
 *
 * <h3>Obtinerea din serviciu a story-urilor, sau actualizarea bazei de date cu noi astfel de entitati va fi realizabila doar
 * prin implementarea unei interfete de tip Repository care sa contina o metoda de adaugare si una de obtinere a acestor
 * informatii. Instanta interfetei IStoryRepository va putea fi integrata in cadrul serviciului, tot prin intermediul
 * injectiei de dependinta.</h3>
 */

@RestController
@RequestMapping("/story")
public class StoryController {

    /**
     * <b>Serviciul specific entitatii de tip story (poveste)</b>
     */
    private final StoryService storyService;

    /**
     * <h1>Constructor de initializare</h1>
     * <h3>Utilizeaza injectia de dependinta pentru a initializa serviciul.
     * </h3>
     *
     * @param storyService <b>serviciul aferent entitatii Story, introdus prin injectie de dependinta</b>
     */
    public StoryController(StoryService storyService) {
        this.storyService = storyService;
    }

    /**
     * <h1>Metoda GET</h1>
     * <h3>Returnează un obiect de tipul List<Story> in care vor fi stocate toate story-urile
     * relevante pentru un utilizator (atât story-urile încărcate de el însuși, cat si cele încărcate de alte persoane)</h3>
     *
     * @return <b>O lista de povesti in care vor fi stocate toate povestile disponibile in baza de date la momentul realizarii request-ului</b>
     */
    @GetMapping("")
    public List<Story> retrieveStories() {
        return storyService.getStoriesMetadata();
    }

    /**
     * <h1>Metoda POST</h1>
     * <h3>Incarcă in baza de date o nouă poveste</h3>
     * @param payload <b>o instanta a entitatii Story ce va consistui ulterior si payload-ul POST request-ului. Acest payload va contine informatii despre toate informatiile pe care o entitate de tip poveste ar trebui sa le aiba astfel incat sa poata fi integrata in cadrul aplicatiei.</b>
     * @return <b>Entitatea de tip poveste ce tocmai a fost uploadata in baza de date in urma efectuarii request-ului, prin metoda POST.</b>
     */
    @PostMapping("")
    public Story uploadStory(@RequestBody Story payload) {
        return storyService.sendStoryMetadata(payload);
    }
}

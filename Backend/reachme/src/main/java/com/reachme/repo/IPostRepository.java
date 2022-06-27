package com.reachme.repo;

import com.reachme.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**<h1>Interfata IPostRepository</h1>
 *<h3> Acest repository mosteneste interfata JpaRepository si permite accesul la metode ce prelucreaza baza de date
a aplicatiei, prin operatii precum citire (GET), scriere (POST), stergere (DELETE), editare/modificare(PUT/PATCH).</h3>*/
@Repository
public interface IPostRepository extends JpaRepository<Post,Integer> {

    /**<b>Metoda auxiliara, definita pentru a putea obtine o postare, in functie de identificatorul sau unic.
    Metoda va fi utilizata in vederea implementarii metodelor de PATCH, ce vor permite anumite schimbari la nivel
    de postare in cadrul aplicatiei, cum ar fi numarul de likes sau dislikes.</b>
     @param postIdentifier <b>Identificatorul unic al postarii cautate</b
     @return <b>o entitate de tip Post, reprezentand postarea din baza de date identificata prin postIdentifier </b>*/
    Post findByPostIdentifier(String postIdentifier);

    /**<b>Metoda auxiliara, definita pentru a putea elimina o postare in baza identificatorului acesteia.
    Metoda va fi utilizata in vederea implementarii metodei HTTP DELETE, care va permite utilizatorului ce a realizat
    incarcarea postarii pe platforma sa o si stearga, in situatia in care acesta doreste acest lucru</b>
     @param postIdentifier <b>identificatorul unic al postarii</b>
     @return <b>o valoare intreaga de stare, ce va specifica succesul/esecul operatiei efectuate</b>*/
    Integer deletePostByPostIdentifier(String postIdentifier);
}

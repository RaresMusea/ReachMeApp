package com.reachme.repo;

import com.reachme.entity.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


/**
 * <h1>Interfata IStoryRepository</h1>
 * <h3>Mosteneste interfata JpaRepository si permite accesul la metode ce prelucreaza baza de date
 * a aplicatiei, prin operatii precum citire (GET), scriere (POST), stergere (DELETE), editare/modificare(PUT/PATCH).</h3>
 */
@Repository
public interface IStoryRepository extends JpaRepository<Story, Integer> {
}

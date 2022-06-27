package com.reachme.repo;

import com.reachme.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**<h3>Interfata ICommentRepository</h3>
 * <h3> Acest repository mosteneste interfata JpaRepository si permite accesul la metode ce prelucreaza baza de date
a aplicatiei, prin operatii precum citire (GET), scriere (POST), stergere (DELETE), editare/modificare(PUT/PATCH).</h3>*/

@Repository
public interface ICommentRepository extends JpaRepository<Comment,Integer> {
}

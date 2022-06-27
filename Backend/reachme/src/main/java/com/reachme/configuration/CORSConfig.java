package com.reachme.configuration;

import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**<h1>Configurarea Politicilor CORS (Cross Origin Resource Sharing)</h1>
 * <h3>Clasa auxiliara ce va configura politicile CORS ale REST API-ului, astfel incat toate request-urile sa fie functionale si sa nu fie blocate de filterele browserelor din a se executa.
 *</h3>
 * <h3>Totodata, metoda doFilter, mostenita din interfata Filter va fi utilizita si pentru a permite frontend-ului si backend-ului aplicatiei sa functioneze pe port-uri separate</h3>*/
@Component
public class CORSConfig implements Filter{

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException{
        HttpServletResponse resp=(HttpServletResponse) response;
        resp.setHeader("Access-Control-Allow-Origin","*");
        resp.setHeader("Access-Control-Allow-Methods","POST, PUT, GET, OPTIONS, DELETE, PATCH");
        resp.setHeader("Access-Control-Allow-Credentials","true");
        resp.setHeader("Access-Control-Max-Age","3600");
        resp.setHeader("Access-Control-Allow-Headers","Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        chain.doFilter(request,response);
    }
}

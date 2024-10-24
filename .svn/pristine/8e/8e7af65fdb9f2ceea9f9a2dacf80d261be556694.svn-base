package com.vsi.agile.webpx.autotabnumbering.servlets;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.agile.api.APIException;
import com.agile.api.IAgileSession;
import com.google.gson.Gson;
import com.vsi.agile.webpx.autotabnumbering.utils.Utils;

/**
 * Servlet implementation class CreateItemsServlet
 */
public class CreateItemsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static Logger log = Logger.getLogger(CreateItemsServlet.class);

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
     *      response)
     */
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws IOException {
 
        Map<String, Object> respMessage = new HashMap<String, Object>();
        
        respMessage.put("hasError", Boolean.FALSE);
        respMessage.put("errorMessage", "");

        log.debug("type in request: " + request.getParameter("type"));
        Properties prop = null;
        try {
            prop = Utils.loadPropertyFile(Utils.getPropertyFilePath(),
                    "AutoTabNumbering.properties");
        } catch (Exception e) {
           log.fatal("Error loading properties file", e);
            respMessage.put("hasError", Boolean.TRUE);
            respMessage.put("errorMessage", "Error reading properties file. " + e.getMessage());
        }
        if (prop != null) {
            // Get length of tab number, the value where tab numbers start from
            String agileurl = prop.getProperty("agileUrl");
            log.debug("Agile URL in properties file: " + agileurl);
            IAgileSession session = null;
            try {
                session = Utils.getAgileSession(agileurl, request);
            } catch (APIException e1) {
                log.error("APIException in CreateItems Servlet in getting session", e1);
                respMessage.put("hasError", Boolean.TRUE);
                respMessage.put("errorMessage", "Agile session could not be created. " + e1.getMessage());
            }
            if (session != null) {
                if ((request.getParameter("type") != null && request.getParameter("type").equalsIgnoreCase("list"))) {

                    log.debug("Request to get subclasslist");
                    response.setContentType("application/json");
                    String baseClass = request.getParameter("baseClass");
                    log.debug("Base Class in request : " + baseClass);
                    
                    String itemNum = request.getParameter("num");
                    log.debug("item number in request : " + itemNum);
                    
                    try {
                        List<Map<String, Object>> classes = Utils.getSubclases(session, prop, baseClass,itemNum);
                        if(classes.isEmpty())
                        {
                        	 String message = "Can't be launched on sub-document.";
                             respMessage.put("hasError", Boolean.TRUE);
                             respMessage.put("errorMessage", message);
                        }
                        else
                        	respMessage.put("classes", classes);
                    } catch (APIException e) {
                        log.error("APIException in CreateItems Servlet in getting subclasses", e);
                        String message = "Error getting subclass list from agile. " + e.getMessage();
                        respMessage.put("hasError", Boolean.TRUE);
                        respMessage.put("errorMessage", message);
                        
                    }
                } else {
                    log.debug("Request to create item");
                    String baseItemNumber = request.getParameter("baseNumber");
                    log.debug("Base number in request : " + baseItemNumber);

                    String descript = request.getParameter("description");
                    log.debug("Description in request: " + descript);                
                    
                    String relatedClassName = request.getParameter("subClass");
                    log.debug("Selected class in request: " + relatedClassName);
                    
                    String userSeqNumber = request.getParameter("sequenceNum");
                    log.debug("Base class in request: " + userSeqNumber);
                    
                    Map<String, String> confirmation = null;

                    try {
                        //confirmation = Utils.checkAndCreateItem(session, agileurl, type_code, base_num, descript, TabNumLength, FirstTabNum);
                        confirmation = Utils.checkAndCreateItem(session, baseItemNumber, relatedClassName, userSeqNumber,descript, prop);
                        respMessage.putAll(confirmation);
                    } catch (Exception e) {
                        log.error("Exception in CreateItems Servlet in creating item", e);
                        String message = "Error getting subclass list from agile. " + e.getMessage();
                        respMessage.put("hasError", Boolean.TRUE);
                        respMessage.put("errorMessage", message);
                    }
                }
            }
        }
        Gson gson = new Gson();
        response.setContentType("application/json");
        response.getWriter().print(gson.toJson(respMessage));
    }

}

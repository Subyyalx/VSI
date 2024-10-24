package com.vsi.agile.configuration;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import com.agile.api.APIException;
import com.agile.api.AgileSessionFactory;
import com.agile.api.IAdmin;
import com.agile.api.IAdminList;
import com.agile.api.IAgileList;
import com.agile.api.IAgileSession;
import com.agile.api.IListLibrary;

public class AutoTabConfig {

    public static void main(String[] args) throws APIException {

        IAgileSession session;
        try {
            Properties prop = loadPropertyFile("configProperies.properties");
            
            String listName = prop.getProperty("listName");
            
            System.out.println("Creating agile session");
            
            session = getAgileSession(prop.getProperty("agileUrl"), prop.getProperty("username"), prop.getProperty("password"));
            
            System.out.println("Session created");

            System.out.println("Getting list " + listName);
            
            IAdmin admin = session.getAdminInstance();
            IListLibrary listLibrary = admin.getListLibrary();
            IAdminList list = listLibrary.getAdminList(listName);

            if (list == null) {
                System.out.println("List does not exist, creating a new one");
                Map<Integer, Object> map = new HashMap<Integer, Object>();
                map.put(IAdminList.ATT_NAME, listName);
                map.put(IAdminList.ATT_DESCRIPTION, "");
                map.put(IAdminList.ATT_ENABLED, new Boolean(true));
                map.put(IAdminList.ATT_CASCADED, new Boolean(true));
                list = listLibrary.createAdminList(map);
                
                System.out.println("List created");
            }

            BufferedReader reader = new BufferedReader(new FileReader("ListContent.txt"));
            
            System.out.println("Reading file");

            IAgileList agileList = list.getValues();
            agileList.clear();
            list.setValues(agileList);
            IAgileList currentList = agileList;

            String line = null;
            while ((line = reader.readLine()) != null) {
                String[] splits = line.split("\\|", -1);

                if (splits.length != 3) {
                    continue;
                }

                if (splits[0].equalsIgnoreCase("b")) {
                    
                    System.out.println("  Parent item: " + splits[1]);

                    currentList = (IAgileList) agileList.addChild(splits[1]);
                    currentList.setDescription(splits[2]);

                } else if (splits[0].equalsIgnoreCase("c")) {
                    
                    System.out.println("  . Child item: " + splits[1]);

                    IAgileList childList = (IAgileList) currentList.addChild(splits[1]);
                    childList.setDescription(splits[2]);

                }

            }

            System.out.println("Saving list to agile");
            
            list.setValues(agileList);
            
            System.out.println("Saved");

            reader.close();
            session.close();

        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }

    public static IAgileSession getAgileSession(String ServerURL, String UserName, String Password) throws APIException {
        AgileSessionFactory f = AgileSessionFactory.getInstance(ServerURL);
        Map<Integer, String> params = new HashMap<Integer, String>();
        params.put(AgileSessionFactory.USERNAME, UserName);
        params.put(AgileSessionFactory.PASSWORD, Password);
        IAgileSession session = f.createSession(params);
        return session;
    }

    public static Properties loadPropertyFile(String path) {
        Properties properties = new Properties();
        InputStream stream;
        try {
            stream = new FileInputStream(path);
            properties.load(stream);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return properties;
    }
}

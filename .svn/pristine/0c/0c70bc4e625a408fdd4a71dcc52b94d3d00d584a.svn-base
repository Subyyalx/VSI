package com.vsi.agile.webpx.autotabnumbering.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;

import com.agile.api.APIException;
import com.agile.api.AgileSessionFactory;
import com.agile.api.IAdmin;
import com.agile.api.IAdminList;
import com.agile.api.IAgileClass;
import com.agile.api.IAgileList;
import com.agile.api.IAgileSession;
import com.agile.api.IAutoNumber;
import com.agile.api.IDataObject;
import com.agile.api.IItem;
import com.agile.api.IListLibrary;
import com.agile.api.IProperty;
import com.agile.api.IQuery;
import com.agile.api.IRow;
import com.agile.api.ITable;
import com.agile.api.ItemConstants;
import com.agile.api.PropertyConstants;

public class Utils {

    private static Logger log = Logger.getLogger(Utils.class);
    private static final String CONFIGDIRECTORYENVVAR = "AgilePXConfig";
    private static final String DEFAULTCONFIGPATH = "C:/AgilePXConfig";

    public static String getPropertyFilePath() {

        log.debug("Getting environment variable: " + CONFIGDIRECTORYENVVAR);

        String envPath = System.getenv(CONFIGDIRECTORYENVVAR);
        if (envPath != null && !envPath.trim().isEmpty()) {
            System.out.println("Environment Variable Path found: " + envPath);
            log.debug("Exiting getPropertyFilePath..");
            return envPath;
        }

        log.info("Environment variable path not found, returning default path: "
                + DEFAULTCONFIGPATH + ". Exiting getPropertyFilePath..");

        return DEFAULTCONFIGPATH;
    }

    public static Properties loadPropertyFile(String directory,
            String propertyFilename) throws IOException {
        log.debug("Entering loadPropertyFile..");

        String path = directory;
        if (!path.endsWith("/") && !path.endsWith("\\")) {
            path += File.separator;
        }
        path += propertyFilename;

        return loadPropertyFile(path);
    }

    public static Properties loadPropertyFile(String path) throws IOException {
        log.debug("Loading properties file: " + path);

        Properties properties = new Properties();
        InputStream stream = null;
        try {
            stream = new FileInputStream(path);
            properties.load(stream);
        } finally {
            if (stream != null) {
                try {
                    stream.close();
                } catch (IOException e) {
                    // Ignoring exception
                    e.printStackTrace();
                }
            }
        }

        PropertyConfigurator.configure(properties);
        log.debug("Exiting loadPropertyFile.Properties: " + properties);
        return properties;
    }

    public static Map<String, String> checkAndCreateItem(IAgileSession session, String baseItemNumber, String relatedClassName, String userSeqNumber, String description, Properties prop) throws APIException {
    	log.debug("Entering checkAndCreateItem..");
    	IItem baseItem = (IItem) session.getObject(IItem.OBJECT_TYPE, baseItemNumber);

        String subclassName = baseItem.getAgileClass().getName();
        log.debug("Subclass of item: "+ subclassName);
        
        Map<String, String> propMap = getProperty(session, subclassName, relatedClassName, prop);
        
        String baseNumber = baseItemNumber;
        
        String prefix = getPropValue(propMap, prop, "Config.Prefix");
        if(prefix.isEmpty()) {
            prefix = relatedClassName.toUpperCase();
        }
        log.debug("Prefix of item to be created: "+ prefix);
        
        String hyphenAfterPrefix = getPropValue(propMap, prop, "Config.IncludeHyphenAfterPrefix");
        if(hyphenAfterPrefix.equalsIgnoreCase("True")) {
            prefix += "-";
        }
        log.debug("Prefix of item to be created: "+ prefix);
        
        
        String seqNumLength = getPropValue(propMap, prop, "Config.SeqLength");
        
        String startValue = getPropValue(propMap, prop, "Config.StartValue");
        
        String removeHyphenFromBase = getPropValue(propMap, prop, "Config.RemoveHyphen");
        
        if(removeHyphenFromBase.equalsIgnoreCase("True")) {
        	log.debug("removeHyphenFromBase equals true");
            baseNumber = baseNumber.replace("-", "");
        }
        
        String removeTabMarker = getPropValue(propMap, prop, "Config.RemoveTab");
        if(removeTabMarker.equalsIgnoreCase("true")) {
        	log.debug("removeTabMarker equals true");
            if(baseNumber.toUpperCase().endsWith("-TAB")) {
                baseNumber = baseNumber.substring(0, baseNumber.length() - 4);
            }
        }
        
        log.debug("Base number of item to be created: "+ baseNumber);
        String itemNumberToCreate = prefix + baseNumber;
        
        log.debug("itemNumberToCreate: " + itemNumberToCreate);
        
        String nextSeq = getPropValue(propMap, prop, "Config.SeqInput");
        
        int seqNumber = 0;
        if(nextSeq.equalsIgnoreCase(prop.getProperty("Config.SeqInput.Auto"))) {
            
            String tempItemNumberToCreate = itemNumberToCreate + "-";
            
            // Search type_code-base_num-
            String queryStatement = "SELECT " + "[Title Block.Number] " + "FROM [" +subclassName + "] "
                    + "WHERE " + "[Title Block.Number] starts with '" + tempItemNumberToCreate
                    + "'";
            
            log.debug("Query statement : "+ queryStatement);
            IQuery query = (IQuery) session.createObject(IQuery.OBJECT_TYPE, queryStatement);
            log.debug(queryStatement);
            
            ITable results = query.execute();
            Iterator<IRow> it = results.iterator();

            // if has results
            if (it.hasNext()) {
                log.debug("Search has results");
                int tabnum = getMaxTabNumber(results);
                // Next TabNumber would be Existing TabNumber + 1
                seqNumber = tabnum + 1;
            } else {
                log.debug("No item found starting with " + tempItemNumberToCreate);
                seqNumber = Integer.parseInt(startValue);
            }

        } else if(nextSeq.equalsIgnoreCase(prop.getProperty("Config.SeqInput.User"))) {
        	   log.debug("Sequence input from user ");
        	seqNumber = Integer.parseInt(userSeqNumber);
        }
        
        if(!nextSeq.equalsIgnoreCase(prop.getProperty("Config.SeqInput.None"))) {
            String nextSequenceNum = String.format("%0" + seqNumLength + "d", seqNumber);
            log.debug("Next Sequence number generated: "+ nextSequenceNum);
            itemNumberToCreate += "-" + nextSequenceNum;
        }
                
        HashMap<Integer, String> attributes = new HashMap<Integer, String>();
        attributes.put(ItemConstants.ATT_TITLE_BLOCK_DESCRIPTION, description);
        
        attributes.put(ItemConstants.ATT_TITLE_BLOCK_NUMBER, itemNumberToCreate);
        IItem doc = (IItem) session.createObject(subclassName, attributes);
        doc.logAction("Parent item: " + baseItemNumber);
        
        String agileurl = prop.getProperty("agileUrl");
        if(!agileurl.endsWith("/")) {
            agileurl += "/";
        }
        String url = getObjectShortUrl(agileurl, doc);
        
        Map<String, String> returnMap = new HashMap<String, String>();
        returnMap.put("itemNumberToCreate", itemNumberToCreate);
        returnMap.put("url", url);
        
        IItem parent=(IItem) session.getObject(IItem.OBJECT_TYPE, baseItemNumber);
        parent.logAction("New Child item created: " + itemNumberToCreate);
        
        log.debug("Exiting checkAndCreateItem...");
        return returnMap;
    }
    
    
    public static String getBaseItemPropPrefix(Properties prop, String baseClassName) {
    	log.debug("Entering getBaseItemPropPrefix...");
        String[] baseClasses = prop.getProperty("baseItems").split(",");     
        List<Map<String, Object>> responseList = new ArrayList<Map<String,Object>>();
        
        String propPrefix = null;
        for (String baseClass : baseClasses) {
            String name = prop.getProperty("baseItems." + baseClass + ".name");
            if (name.equalsIgnoreCase(baseClassName)) {
                propPrefix = "baseItems." + baseClass;
                break;
            }
        }
    	log.debug("Exiting getBaseItemPropPrefix.BaseItem propPrefix: "+propPrefix);
        return propPrefix; 
    }
    

    public static String getRelatedClassPropPrefix(Properties prop, String basePropPrefix, String relatedClassName) {
    	log.debug("Entering getRelatedClassPropPrefix...");
    	String propPrefix = null;
        String [] relatedClasses = prop.getProperty(basePropPrefix + ".related").split(",");
        
        for(String relatedClass : relatedClasses) {
            String prefix = basePropPrefix + ".related." + relatedClass;
            String name = prop.getProperty(prefix + ".name");
            if(name.equalsIgnoreCase(relatedClassName)) {
                propPrefix = prefix;
                break;
            }
        }
        
        log.debug("Exiting getRelatedClassPropPrefix.RelatedClass propPrefix: "+propPrefix);
        return propPrefix;
    }

    @SuppressWarnings("unchecked")
    private static int getMaxTabNumber(ITable results) throws APIException {
        log.debug("Iterating results to get getMaxTabNumber...");

        Iterator<IRow> it = results.iterator();
        int maxNum = -1;
        while (it.hasNext()) {
            IRow row = it.next();
            String number = (String) row
                    .getValue(ItemConstants.ATT_TITLE_BLOCK_NUMBER);
            // get tab number
            String[] array = number.split("-");

            if (array.length != 3) {
                log.warn("Item number " + number + " not standard");
            } else {
                int tabnum = toInt(array[2]);
                if (tabnum > maxNum) {
                    maxNum = tabnum;
                }
            }
        }

        log.debug("Exiting getMaxTabNumber.Maximum tab number: " + maxNum);
        return maxNum;

    }

    public static String getObjectShortUrl(String agileUrl, IDataObject agileObject)
            throws APIException {
        log.debug("Entering getObjectShortUrl...");

        String url = "";
        String ObjectName = agileObject.getName();
        String ObjectType = getBaseClass(agileObject).toString();
        url = agileUrl + "object/" + ObjectType + "/" + ObjectName;
        log.debug("Exiting getObjectShortUrl...");
        return url;
    }

    public static IAgileClass getBaseClass(IDataObject agileObject)
            throws APIException {
        log.debug("Entering getBaseClass...");

        IAgileClass baseClass = agileObject.getAgileClass().getSuperClass();
        log.debug("Exiting getBaseClass.Base class: " + baseClass);
        return baseClass;
    }

    public static IAgileSession getAgileSession(String url, HttpServletRequest request)
            throws APIException {
        log.debug("Entering getAgileSession...");

        AgileSessionFactory factor = AgileSessionFactory.getInstance(url);
        Map<Object, Object> params = new HashMap<Object, Object>();
        params.put(AgileSessionFactory.PX_REQUEST, request);
        IAgileSession session = factor.createSession(params);

        log.debug("Exiting getAgileSession.Agile username: "
                + session.getCurrentUser().getName());
        return session;
    }

    public static List<Map<String, Object>> getSubclases(IAgileSession session, Properties prop, String subclassName,String itemNumber) throws APIException {
        log.debug("Entering getSubclases...");
        
        IAdmin admin = session.getAdminInstance();
        IListLibrary listLibrary = admin.getListLibrary();
        IAdminList list = listLibrary.getAdminList(prop.getProperty("Config.ListName"));
        log.debug("Agile list to get values from: " + list.getName());
        
        IAgileList agileList = list.getValues();
        
        List<Map<String, Object>> responseList = new ArrayList<Map<String,Object>>();
       
        Map<String, String> rootValueMap = getProps(prop, (String) agileList.getValue(), agileList.getDescription());
        
        for(Object childList : agileList.getChildren()) {
            if(childList instanceof IAgileList) {
                String name = (String) ((IAgileList) childList).getValue();
                if(name.equalsIgnoreCase(subclassName)) {
                
                	Map<String, String> baseValueMap = getProps(prop, (String) ((IAgileList) childList).getValue(), ((IAgileList) childList).getDescription());
                    rootValueMap.putAll(baseValueMap);   
                    String list_prefix = rootValueMap.get(prop.getProperty("Config.Prefix"));
                    
                  if (itemNumber.startsWith(list_prefix))
                  {
                    log.debug("Getting class level list");
                    for(Object relatedClassLevelList : ((IAgileList) childList).getChildren()) {
                        if(relatedClassLevelList instanceof IAgileList) {
                            String relName = (String) ((IAgileList) relatedClassLevelList).getValue();
                            String desc = ((IAgileList) relatedClassLevelList).getDescription();
                            Map<String, String> propMap = new HashMap<String, String>();
                            propMap.putAll(rootValueMap);
                            propMap.putAll(getProps(prop, relName, desc));
                            
                            boolean displayInt = propMap.get(prop.getProperty("Config.SeqInput")).equalsIgnoreCase(prop.getProperty("Config.SeqInput.User"));
                            
                            Map<String, Object> valueMap = new HashMap<String, Object>();
                            valueMap.put("name", relName);
                            valueMap.put("sequenceRequired", Boolean.valueOf(displayInt));
                            valueMap.put("sequenceLength", getPropValue(propMap, prop, "Config.SeqLength"));

                            responseList.add(valueMap);
                        }
                    }
                  }
                }
            }
        }
            
        log.debug("Exiting getSubclases with subclass list: " + responseList);
        return responseList;
    }
    
    public static Map<String, String> getProperty(IAgileSession session, String baseClass, String relatedClass, Properties prop) throws APIException {
    	  log.debug("Entering getProperty...");
    	IAdmin admin = session.getAdminInstance();
        IListLibrary listLibrary = admin.getListLibrary();
        IAdminList list = listLibrary.getAdminList(prop.getProperty("Config.ListName"));
        log.debug("Agile list to get values from: " + list.getName());
        IAgileList agileList = list.getValues();
        
        Map<String, String> valueMap = getProps(prop, (String) agileList.getValue(), agileList.getDescription());
        
        for(Object childList : agileList.getChildren()) {
            if(childList instanceof IAgileList) {
                String name = (String) ((IAgileList) childList).getValue();
                if(name.equalsIgnoreCase(baseClass)) {
                    valueMap.putAll(getProps(prop,(String) ((IAgileList) childList).getValue(),((IAgileList) childList).getDescription()));
                    for(Object relatedClassLevelList : ((IAgileList) childList).getChildren()) {
                        if(relatedClassLevelList instanceof IAgileList) {
                            String relName = (String) ((IAgileList) relatedClassLevelList).getValue();
                            if(relName.equalsIgnoreCase(relatedClass)) {
                            	log.debug("Subclass to get values from: " + relName);
                                String value = (String) ((IAgileList) relatedClassLevelList).getValue();
                                String desc = ((IAgileList) relatedClassLevelList).getDescription();
                            	log.debug("Properties in description: " + desc);
                                valueMap.put(prop.getProperty("Config.Name"), relName);
                                valueMap.putAll(getProps(prop, value, desc));break;
                            }
                        }
                    }
                }
            }
        }
        log.debug("Exiting getProperty...");
        return valueMap;
    }
    
    public static Map<String, String> getProps(Properties property, String name, String propString) {
    	
    	log.debug("Entering getProps...");
        Map<String, String> map = new HashMap<String, String>();
        map.put(property.getProperty("Config.Prefix"), name);
        if(propString != null) {
            String propDelim = property.getProperty("Config.PropertyDelim");
            String keyValueDelim = property.getProperty("Config.KeyValueDelim");
            
            String [] props = propString.split(propDelim);
            for(String prop: props) {
                if(prop.contains(keyValueDelim)) {
                    String[] keyValue = prop.split(keyValueDelim);
                    String key = keyValue[0].trim();
                    String value = keyValue[1].trim();
                    map.put(key, value);
                }
            }
        }
    	log.debug("Exiting getProps with property map: "+ map);
        return map;
    }

    public static String getPrefixForDefaultAutoNumber(IAgileSession session,
            String agileClassName) throws Exception {

        log.debug("Entering getPrefixForDefaultAutoNumber...");

        IAdmin admin = session.getAdminInstance();
        IAgileClass agileClass = admin.getAgileClass(agileClassName);
        if (agileClass == null) {
            throw new NullPointerException("Agile class " + agileClassName
                    + " could not be retrieved");
        }

        IAutoNumber[] autoNumberSources = agileClass.getAutoNumberSources();

        String prefix = null;
        if (autoNumberSources != null && autoNumberSources.length > 0) {
            IAutoNumber autoNumber = autoNumberSources[0];

            IProperty prefixProperty = autoNumber
                    .getProperty(PropertyConstants.PROP_PREFIX);
            prefix = (String) prefixProperty.getValue();
        } else {
            throw new Exception("No auto-numbers found for Agile class "
                    + agileClassName);
        }

        log.debug("Exiting getPrefixForDefaultAutoNumber with typeCode: "
                + prefix);
        return prefix;
    }
    
    public static int toInt(String value) {
        int i = 0;
        try {
            i = Integer.parseInt(value);
        } catch(Exception e) {
            log.warn("Could not convert " + value + " to int", e);
        }
        
        return i;
    }
    
    public static String getPropValue(Map<String, String> map, Properties prop, String key) {
    	log.debug("Getting property value of " + key);
        String mapKey = prop.getProperty(key);
    	log.debug( "Value of " + key + ":" + mapKey );
        if(map.containsKey(mapKey)) {
            return map.get(mapKey);
        }     
        return "";
    }

}

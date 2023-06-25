<?xml version="1.0" encoding="UTF-8"?>
<!-- ============================================================= -->
<!--                    HEADER                                     -->
<!-- ============================================================= -->
<!--  MODULE:    DITA country MOD                                  -->
<!--  VERSION:   1.2                                               -->
<!--  DATE:      June 2023                                         -->
<!--  Delivered as file "country.mod"                              -->
<!-- ============================================================= -->


<!-- ============================================================= -->
<!--                   ARCHITECTURE ENTITIES                       -->
<!-- ============================================================= -->

<!-- default namespace prefix for DITAArchVersion attribute can be
     overridden through predefinition in the document type shell   -->
<!ENTITY % DITAArchNSPrefix
  "ditaarch"
>

<!-- must be instanced on each topic type                          -->
<!ENTITY % arch-atts 
             "xmlns:%DITAArchNSPrefix; 
                        CDATA
                                  #FIXED 'http://dita.oasis-open.org/architecture/2005/'
              %DITAArchNSPrefix;:DITAArchVersion
                        CDATA
                                  '1.2'
"
>

<!-- ============================================================= -->
<!--                   SPECIALIZATION OF DECLARED ELEMENTS         -->
<!-- ============================================================= -->


<!ENTITY % country-info-types 
  "%info-types;
  "
>

<!-- ============================================================= -->
<!--                   ELEMENT NAME ENTITIES                       -->
<!-- ============================================================= -->
 

<!ENTITY % country                  "country" >
<!ENTITY % countrybody              "countrybody" >
<!ENTITY % flag                     "flag" >
 
<!-- ============================================================= -->
<!--                    DOMAINS ATTRIBUTE OVERRIDE                 -->
<!-- ============================================================= -->


<!ENTITY included-domains 
  ""
>

<!-- ============================================================= -->
<!--                    ELEMENT DECLARATIONS                       -->
<!-- ============================================================= -->

<!--                    LONG NAME: country -->

<!ELEMENT country       ((%title;), 
   (%flag;), 
   (%titlealts;)?,
   (%prolog;)?, 
   (%countrybody;)?, 
   (%related-links;)?,
   (%body;)*, (%country-info-types;)* )  >
<!ATTLIST country
             id         ID                               #REQUIRED
             conref     CDATA                            #IMPLIED
             %arch-atts;
             domains    CDATA                "&included-domains;"  
>


<!--                    LONG NAME: country -->      

<!ELEMENT countrybody              (%table; | %section;)*>
<!ATTLIST countrybody
                                  outputclass CDATA #IMPLIED
>

<!--                    LONG NAME: flag -->   

<!ELEMENT flag              (%fig;)?>
<!ATTLIST flag
                                  outputclass CDATA #IMPLIED
>


<!-- ============================================================= -->
<!--                    SPECIALIZATION ATTRIBUTE DECLARATIONS      -->
<!-- ============================================================= -->

<!ATTLIST country          %global-atts;  class CDATA "- topic/topic concept/concept country/country ">
<!ATTLIST countrybody      %global-atts;  class CDATA "- topic/body  concept/conbody country/countrybody ">
<!ATTLIST flag             %global-atts;  class CDATA "- topic/body  concept/conbody country/flag ">

<!-- ================== End DITA Concept  ======================== -->

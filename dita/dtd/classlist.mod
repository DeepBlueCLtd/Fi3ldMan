<?xml version="1.0" encoding="UTF-8"?>
<!-- ============================================================= -->
<!--                    HEADER                                     -->
<!-- ============================================================= -->
<!--  MODULE:    DITA classlist MOD                                -->
<!--  VERSION:   1.2                                               -->
<!--  DATE:      June 2023                                         -->
<!--  Delivered as file "classlist.mod"                            -->
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


<!ENTITY % concept-info-types 
  "%info-types;
  "
>

<!-- ============================================================= -->
<!--                   ELEMENT NAME ENTITIES                       -->
<!-- ============================================================= -->
<!ENTITY % classlist                "classlist" >
<!ENTITY % countrybody              "countrybody" >
<!ENTITY % flag                     "flag" >
<!ENTITY % title                     "title" >

<!-- ============================================================= -->
<!--                    DOMAINS ATTRIBUTE OVERRIDE                 -->
<!-- ============================================================= -->


<!ENTITY included-domains 
  ""
>


<!-- ============================================================= -->
<!--                    ELEMENT DECLARATIONS                       -->
<!-- ============================================================= -->

<!--                    LONG NAME: Classlist  -->
<!ENTITY % classlist.content
 "
  ((%title;)?,
   (%flag;), 
   (%countrybody;)?)                   
">
<!ENTITY % classlist.attributes
'            id         ID                               #REQUIRED
             conref     CDATA                            #IMPLIED
             %arch-atts;
             outputclass 
                        CDATA                            #IMPLIED
             domains    CDATA                "&included-domains;"    
'>
<!ELEMENT classlist %classlist.content; >
<!ATTLIST classlist %classlist.attributes; > 

<!--                    LONG NAME: countrybody details -->
<!ENTITY % countrybody.content
"
  (%table; | %section;)*    
">
<!ENTITY % countrybody.attributes
'
             outputclass 
                        CDATA                            #IMPLIED    
'>
<!ELEMENT countrybody %countrybody.content; >
<!ATTLIST countrybody %countrybody.attributes; > 

<!--                    LONG NAME: flag details -->
<!ENTITY % flag.content
"
  (%fig;)?    
">
<!ENTITY % flag.attributes
'
             outputclass 
                        CDATA                            #IMPLIED    
'>
<!ELEMENT flag %flag.content; >
<!ATTLIST flag %flag.attributes; > 

<!-- ============================================================= -->
<!--                    SPECIALIZATION ATTRIBUTE DECLARATIONS      -->
<!-- ============================================================= -->

<!ATTLIST classlist              %global-atts;  class CDATA "- topic/topic concept/concept classlist/classlist ">
<!ATTLIST title                  %global-atts;  class CDATA "- topic/title  concept/title classlist/title ">
<!ATTLIST flag                   %global-atts;  class CDATA "- topic/body  concept/conbody classlist/flag ">
<!ATTLIST countrybody            %global-atts;  class CDATA "- topic/body  concept/conbody classlist/countrybody ">


<!-- ================== End DITA Concept  ======================== -->





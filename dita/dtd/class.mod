<!-- ============================================================= -->
<!--                    HEADER                                     -->
<!-- ============================================================= -->
<!--  MODULE:    DITA class Mod                                    -->
<!--  VERSION:   1.2                                               -->
<!--  DATE:      June 2023                                         -->
<!--  Delivered as file "class.mod"                                -->
<!-- ============================================================= -->

<!-- ============ Specialization of declared elements ============  -->
<!ENTITY % class                 "class">
<!ENTITY % body             "body">
<!ENTITY % summary       "summary">
<!ENTITY % signatures                    "signatures">
<!ENTITY % propulsion                   "propulsion">
<!ENTITY % propulsionRef                   "propulsionRef">
<!ENTITY % remarks                      "remarks">
<!ENTITY % span                           "span">
<!ENTITY % images                           "images">


<!ELEMENT class              ((%title;), (%body;))>
<!ATTLIST class            id ID #REQUIRED
                                  conref CDATA #IMPLIED
                                  %arch-atts;
                                  domains CDATA "&included-domains;"
>

<!ELEMENT body          ((%images;), (%summary;), (%signatures;)?, (%propulsion; | %propulsionRef;)?, (%remarks;)?, (%related-pages;)? )>
<!ATTLIST body              
                                        outputclass CDATA #IMPLIED
>
<!--
<!ELEMENT summary          ((%property;), (%property;), (%property;), (%property;), (%property;), (%property;)) >
-->
<!ELEMENT summary          ((%table;)) >
<!ATTLIST summary
                                outputclass CDATA #IMPLIED
>
<!ATTLIST summary id ID #REQUIRED>

<!ELEMENT signatures    (%section.cnt;)* >
<!ATTLIST signatures
                                  outputclass CDATA #IMPLIED
>
<!ATTLIST signatures id ID #REQUIRED>

<!ELEMENT propulsion    (%section.cnt;)* >
<!ATTLIST propulsion    
                                  outputclass CDATA #IMPLIED
>
<!ATTLIST propulsion id ID #REQUIRED>

<!ELEMENT propulsionRef    ((%title;)?, (%xref;)?) >
<!ATTLIST propulsionRef    
                                  outputclass CDATA #IMPLIED
>
<!ATTLIST propulsionRef id ID #REQUIRED>

<!ELEMENT remarks    ((%title;)?, (%span;)*) >
<!ATTLIST remarks     
                                  outputclass CDATA #IMPLIED
>
<!ATTLIST remarks id ID #REQUIRED>

<!ELEMENT links     (%section.cnt;)* >
<!ATTLIST links    
                                  outputclass CDATA #IMPLIED
>
<!ATTLIST links id ID #REQUIRED>

<!ELEMENT span    ((%ol;)*, (%p;)*) >
<!ATTLIST span    
                                  conref CDATA #IMPLIED
                                  outputclass CDATA #IMPLIED
>

<!ELEMENT images              ((%image;)*)>
<!ATTLIST images
                                  outputclass CDATA #IMPLIED
>

<!--specialization attributes-->

<!-- class extends reference -->
<!ATTLIST class              class  CDATA "- topic/topic  reference/reference class/class ">

<!-- body extends refBody, summary is compulsory, other 3 child elements (signature, propulsion, remarks) optional -->
<!ATTLIST body          class  CDATA "- topic/body reference/refBody class/body ">

<!-- summary extends properties.  -->
<!ATTLIST summary          class  CDATA "- topic/section class/summary ">

<!-- signatures extends section, allows free content in Phase 1. Constrained table in Phase 2 -->
<!ATTLIST signatures    class  CDATA "- topic/section class/signatures ">

<!-- extends section -->
<!ATTLIST propulsion    class  CDATA "- topic/section class/propulsion ">

<!-- extends section -->
<!ATTLIST propulsionRef    class  CDATA "- topic/section class/propulsionRef ">

<!-- extends section -->
<!ATTLIST remarks    class  CDATA "- topic/section class/remarks ">

<!-- extends section -->
<!ATTLIST related-pages    class  CDATA "- topic/section class/related-pages ">

<!-- sp extends p -->
<!ATTLIST span    class  CDATA "- topic/p  class/span ">

<!-- images -->
<!ATTLIST images             %global-atts;  class CDATA "- topic/body reference/refBody class/images ">







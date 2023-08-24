<!-- ============================================================= -->
<!--                    HEADER                                     -->
<!-- ============================================================= -->
<!--  MODULE:    DITA class Mod                                    -->
<!--  VERSION:   1.2                                               -->
<!--  DATE:      June 2023                                         -->
<!--  Delivered as file "class.mod"                                -->
<!-- ============================================================= -->
<!-- ============ Specialization of declared elements ============  -->
<!ENTITY % p5-topic         "p5-topic">
<!ENTITY % title             "title">
<!ENTITY % body             "body">
<!ENTITY % title             "title">
<!ENTITY % block             "block">
<!ENTITY % span             "span">
<!ENTITY % xref             "xref">
<!ENTITY % related-pages "related-pages">
<!ELEMENT p5-topic              ((%title;), (%body;))>
<!ATTLIST p5-topic                   id ID #REQUIRED
                                  conref CDATA #IMPLIED
                                  %arch-atts;
                                  domains CDATA "&included-domains;"
>
<!ELEMENT body          ((%related-pages;)?, (%block;)* )>
<!ATTLIST body              
                                        outputclass CDATA #IMPLIED
>
<!ELEMENT block    ((%title;)?, (%span;)*) >
<!ATTLIST block    id ID #REQUIRED
                                  outputclass CDATA #IMPLIED
>
<!ELEMENT related-pages ((%title;), (%xref;)*) >
<!ATTLIST related-pages 
                                    id ID #REQUIRED
                                    outputclass CDATA #IMPLIED>
<!--specialization attributes-->
<!-- class extends reference -->
<!ATTLIST class              class  CDATA "- topic/topic  reference/reference class/class ">
<!-- body extends refBody, summary is compulsory, other 3 child elements (signature, propulsion, remarks) optional -->
<!ATTLIST body          class  CDATA "- topic/body reference/refBody class/body ">
<!-- extends section -->
<!ATTLIST block    class  CDATA "- topic/section class/block ">
<!-- extends section -->
<!ATTLIST related-pages    class  CDATA "- topic/section class/related-pages ">
<!-- sp extends p -->
<!ATTLIST span    class  CDATA "- topic/p  class/span ">

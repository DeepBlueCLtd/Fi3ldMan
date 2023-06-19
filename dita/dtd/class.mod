<!-- File   : class.mod                                      -->
<!-- author : Brahnavan Krishnakumar                                -->
<!-- email  : brahnavank@gmail.com                                  -->
<!-- Date   : 18 June 2023                                          -->
<!-- (C) Copyright Deep Blue C Ltd 2023 All Rights Reserved.        -->

<!-- ============ Specialization of declared elements ============  -->
<!ENTITY % class                 "class">
<!ENTITY % classbody             "classbody">
<!ENTITY % classproperties       "classproperties">
<!ENTITY % property                     "property">
<!ENTITY % signature                    "signature">
<!ENTITY % propulsion                   "propulsion">
<!ENTITY % remarks                      "remarks">

<!ENTITY % span                           "span">

<!ELEMENT class              ((%title;), (%classbody;), (%signature;), (%propulsion;), (%remarks;))>
<!ATTLIST class            id ID #REQUIRED
                                  conref CDATA #IMPLIED
                                  %arch-atts;
                                  domains CDATA "&included-domains;"
>

<!ELEMENT classbody          ((%classproperties;), (%section;)* )>
<!ATTLIST classbody              
                                        outputclass CDATA #IMPLIED
>

<!ELEMENT classproperties          (%classproperties; | %property;)* >
<!ATTLIST classproperties
                                outputclass CDATA #IMPLIED
>


<!ELEMENT signature    (%section.cnt;)* >
<!ATTLIST signature
                                  outputclass CDATA #IMPLIED
>

<!ELEMENT propulsion    (%section.cnt;)* >
<!ATTLIST propulsion    
                                  outputclass CDATA #IMPLIED
>

<!ELEMENT remarks    ((%title;)?, (%span;)*) >
<!ATTLIST remarks     
                                  outputclass CDATA #IMPLIED
>

<!ELEMENT span    ((%ol;)?, (%p;)*) >
<!ATTLIST span    
                                  conref CDATA #IMPLIED
                                  outputclass CDATA #IMPLIED
>

<!--specialization attributes-->

<!-- class reference -->
<!ATTLIST class              class  CDATA "- topic/topic reference/reference class/class ">

<!-- extends refBody, classProperties is compulsory, other 3 child elements optional -->
<!ATTLIST classbody          class  CDATA "- topic/body reference/refBody class/classbody ">

 <!-- extends properties. unconstrained in Phase 1 but with 6 specific propTypes in Phase 2 -->
<!ATTLIST classproperties          class  CDATA "- topic/simpletable reference/properties  class/classproperties ">

<!-- extends section, allows free content in Phase 1. Constrained table in Phase 2 -->
<!ATTLIST signature    class  CDATA "- topic/section class/signature ">

<!-- extends section -->
<!ATTLIST propulsion    class  CDATA "- topic/section class/propulsion ">

<!-- extends section -->
<!ATTLIST remarks    class  CDATA "- topic/section class/remarks ">

<!-- sp extends p -->
<!ATTLIST span    class  CDATA "- topic/p  class/span ">



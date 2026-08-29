<?xml version="1.0" encoding="UTF-8"?>
<!--
    Fi3ldMan customization for the MainPage WebHelp XSLT extension point.

    All three extension points share the same customizations, so they all import
    the same includes.

    NOTE: the Oxygen 2024 version of customTopicPage.xsl also overrode
    <whc:page_libraries>, injecting a hard-coded list of Oxygen's own CSS/JS
    bundles. That override is deliberately gone - it is what broke the output
    under Oxygen 2026. Custom scripts are now added via the
    `webhelp.fragment.head.topic.page` fragment instead.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:oxy="http://www.oxygenxml.com/ns/author/xpath-extension-functions"
    xmlns:toc="http://www.oxygenxml.com/ns/webhelp/toc"
    xmlns:index="http://www.oxygenxml.com/ns/webhelp/index"
    xmlns:oxygen="http://www.oxygenxml.com/functions"
    xmlns:d="http://docbook.org/ns/docbook"
    xmlns:whc="http://www.oxygenxml.com/webhelp/components"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:oxyf="http://www.oxygenxml.com/functions"
    exclude-result-prefixes="#all" version="2.0">

    <xsl:import href="inc/customHeader.xsl"/>
    <xsl:import href="inc/customFooter.xsl"/>

</xsl:stylesheet>

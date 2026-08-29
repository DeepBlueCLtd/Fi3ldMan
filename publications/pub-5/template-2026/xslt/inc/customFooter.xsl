<?xml version="1.0" encoding="UTF-8"?>
<!--
    Fills in the `wh_footer_protection` bar declared in page-templates/footer.xml.
    Driven by the `webhelp.show.protection`, `webhelp.protection.text` and
    `webhelp.protection.background.color` parameters (see f13ldMan.opt).

    Unchanged from the Oxygen 2024 template - all the hooks it relies on still
    exist in Oxygen 28.1.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:toc="http://www.oxygenxml.com/ns/webhelp/toc"
    xmlns:index="http://www.oxygenxml.com/ns/webhelp/index"
    xmlns:oxygen="http://www.oxygenxml.com/functions"
    xmlns:d="http://docbook.org/ns/docbook"
    xmlns:whc="http://www.oxygenxml.com/webhelp/components"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:oxyf="http://www.oxygenxml.com/functions"
    exclude-result-prefixes="#all" version="2.0">

    <xsl:template match="*:footer[contains(@class, 'wh_footer_protection')]" mode="copy_template">
        <xsl:if test="oxyf:getParameter('webhelp.show.protection') = 'yes'">
            <xsl:copy>
                <xsl:copy-of select="@*"/>
                <xsl:if test="oxyf:getParameter('webhelp.protection.background.color') != ''">
                    <xsl:attribute name="style">
                        <xsl:text>background-color:</xsl:text>
                        <xsl:value-of select="oxyf:getParameter('webhelp.protection.background.color')"/>
                    </xsl:attribute>
                </xsl:if>
                <div class=" footer-container mx-auto ">
                    <span>
                        <xsl:value-of select="oxyf:getParameter('webhelp.protection.text')"/>
                    </span>
                </div>
            </xsl:copy>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>

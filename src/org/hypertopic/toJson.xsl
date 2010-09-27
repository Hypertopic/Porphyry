<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:set="http://exslt.org/sets" exclude-result-prefixes="set">
<xsl:output encoding="utf-8"/>

<!--
xsltproc toFreemind.xsl myFreemind.mm > intermediate.mm && xsltproc
toJson.xsl intermediate.mm > result.json
-->

<xsl:key name="byItem" match="highlight" use="@item_name"/>

<xsl:template match="/map/node">
{"docs":
[
<!--Viewpoint-->
{
"_id": "",
"viewpoint_name": "<xsl:value-of select="@text"/>",
"topics": {
	<xsl:apply-templates />
	}
}
<!--items-->
<xsl:for-each select="set:distinct(.//highlight/@item_name)">
{
  "item_name": "<xsl:value-of select="."/>", 
  <!--
  this script is not able to mention topic
  because topic are related to highlight, not to items
  }, 
  -->
  "highlights":
  {
		<xsl:apply-templates select="key('byItem', .)"/>
  }
}

</xsl:for-each>
]
}
</xsl:template>

<!--First level topic-->
<xsl:template match="/map/node/node">
	"<xsl:value-of select="@id"/>": {"name": "<xsl:value-of select="@text"/>"},
		<xsl:apply-templates/>
</xsl:template>

<!--Second level topic-->
<xsl:template match="node">
	"<xsl:value-of select="@id"/>": {"name": "<xsl:value-of select="@text"/>", "broader":["<xsl:value-of select="../@id"/>"]},
</xsl:template>


<!--Item-->
<xsl:template match="highlight">
	{
	"coordinates": [<xsl:value-of select="@begin"/>,<xsl:value-of select="@end"/>],
	"text": "<xsl:value-of select="@text"/>",
	},

</xsl:template>

</xsl:stylesheet>


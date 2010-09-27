<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output encoding="utf-8"/>
<!--
xsltproc toFreemind.xsl myFreemind.mm > intermediate.mm && xsltproc
toJson.xsl intermediate.mm > result.json
-->
<xsl:template match="/map/node">
	<map>
	<node text="{@TEXT}">
		<xsl:apply-templates/>
	</node>
	</map>
</xsl:template>

<xsl:template match="node[@ID]">
	<node id="{@ID}" text="{@TEXT}">
		<xsl:apply-templates/>
	</node>
</xsl:template>

<xsl:template match="node[@LINK]">
	<highlight item_name="{substring-before(substring-after(@LINK,'http://argos.hypertopic.org/entity/LaSuli/www.cassandre.ulg.ac.be/'),'/')}" text="{@TEXT}" begin ="{substring-before(substring-after(substring-after(@LINK,'http://argos.hypertopic.org/entity/LaSuli/www.cassandre.ulg.ac.be/'),'/'),'+')}" end="{substring-after(@LINK,'+')}" link="{@LINK}" topic="{../@ID}">
		<xsl:apply-templates/>
	</highlight>
</xsl:template>

</xsl:stylesheet>

if (!String.prototype.escapeXml) {
    /**
     * Escape all XML special characters. (&, <, >, ", and ')
     *
     * Taken from: http://stackoverflow.com/questions/7918868/how-to-escape-xml-entities-in-javascript
     *
     * @returns {String}
     */
    String.prototype.escapeXml = function escapeXml() {
        return this.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
    };
}

if (!String.prototype.escapeJavaScript) {
    /**
     * Escape all JavaScript string special characters. (\, ", ', and \0)
     *
     * Taken from: http://stackoverflow.com/questions/770523/escaping-strings-in-javascript
     *
     * @returns {String}
     */
    String.prototype.escapeJavaScript = function escapeJavaScript()
    {
        return this.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    }
}

<table>
  <tr>
    <td>
        [01_NOM Vos nom et prénom]
    </td>
    <td style="text-align: right">
        [05_NOM_DEST Nom du destinataire]
    </td>
  </tr>
  <tr>
    <td>
        [02_ADRESSE Votre adresse]
    </td>
    <td style="text-align: right">
        [06_NOM_ENTREPRISE Nom de l'entreprise]
    </td>
  </tr>
  <tr>
    <td>
        [03_CODE_POSTAL Votre code postal] [04_VILLE Votre ville]
    </td>
    <td style="text-align: right">
        [07_ADRESSE_DEST Adresse de l'entreprise]
    </td>
  </tr>
  <tr>
    <td></td>
    <td style="text-align: right">
        [08_CODE_POSTAL_DEST Code postal de l'entreprise] [9_VILLE_DEST Ville de l'entreprise]
    </td>
  </tr>
</table>

[[BLOCK DEST_EST_HOMME] Le destinataire est un homme]Monsieur[[END DEST_EST_HOMME]][[UNLESS DEST_EST_HOMME]]Madame[[ENDUNLESS DEST_EST_HOMME]],

J’ai l’honneur de porter à votre connaissance que je suis démissionnaire de mon poste de [10_POSTE Votre poste] que j’occupe en [CONTRAT Type de contrat] depuis le [DATE_ENTREE Date de début au poste] au sein de votre société.

Je souhaite être dispensé de mon préavis afin que mon départ devienne effectif le [DATE_FIN_SOUHAITEE Date de fin de contrat souhaitée].

Je vous saurais gré également de bien vouloir tenir à ma disposition le solde de mon compte, mon certificat de travail ainsi que mon attestation Pôle emploi.

Je vous prie d’agréer, [[IF DEST_EST_HOMME]]Monsieur[[ENDIF DEST_EST_HOMME]][[UNLESS DEST_EST_HOMME]]Madame[[ENDUNLESS DEST_EST_HOMME]], l’expression de mes sentiments distingués.

Le [~~DATE_DAY]/[~~DATE_MONTH]/[~~DATE_YEAR].

[01_NOM].

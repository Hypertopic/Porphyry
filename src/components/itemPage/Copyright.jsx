import { Trans } from '@lingui/macro';

/**
 * A simple copyright notice.
 */
const Copyright = ({ creator, created }) => {
  let copyrightText;
  // Black and white pictures have a different date format and no author,
  // which means we must handle them separately.
  if (!creator) {
    copyrightText = created;
  } else {
    let yearOrDate;
    // If created is not a valid date
    // (pictures with a creator may have a weird created field too).
    if (isNaN(Date.parse(created))) {
      yearOrDate = created;
    } else {
      yearOrDate = new Date(created).getFullYear().toString();
    }
    copyrightText = <Trans>© {creator}, {yearOrDate}</Trans>;
  }
  return (
    <p className="Copyright pb-3">
      {copyrightText}
    </p>
  );
};

export default Copyright;
const khmerNumerals = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];

/**
 * មុខងារសម្រាប់បម្លែងលេខធម្មតាទៅជាលេខខ្មែរ
 * @param {number|string} num 
 * @returns {string} លេខជាភាសាខ្មែរ
 */
export const toKhmerNumeral = (num) => {
  if (num === null || num === undefined) return "";
  return num
    .toString()
    .split("")
    .map((digit) => (khmerNumerals[digit] !== undefined ? khmerNumerals[digit] : digit))
    .join("");
};

/**
 * មុខងារសម្រាប់បម្លែងម៉ោងទៅជាទម្រង់ខ្មែរ (ឧទាហរណ៍៖ "២ ម៉ោងមុន")
 * @param {string|Date} dateString 
 * @returns {string} ពេលវេលាជាភាសាខ្មែរ
 */
export const formatDate = (dateString, lang = 'km') => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  
  // គណនាគម្លាតពេលវេលាគិតជាវិនាទី
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return lang === 'en' ? "just now" : "មុននេះបន្តិច";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return lang === 'en' 
      ? `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
      : `${toKhmerNumeral(diffInMinutes)} នាទីមុន`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return lang === 'en'
      ? `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
      : `${toKhmerNumeral(diffInHours)} ម៉ោងមុន`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return lang === 'en'
      ? `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
      : `${toKhmerNumeral(diffInDays)} ថ្ងៃមុន`;
  }

  // ប្រសិនបើលើសពី ៧ ថ្ងៃ បង្ហាញកាលបរិច្ឆេទពេញជាភាសាខ្មែរ ឬអង់គ្លេស
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formatter = new Intl.DateTimeFormat(lang === 'en' ? "en-US" : "km-KH", options);
  return formatter.format(date);
};

/**
 * Automatically translates text from Khmer (km) to English (en)
 * using the public MyMemory Translation API.
 * 
 * @param {string} text The Khmer text to translate
 * @returns {Promise<string>} The translated English text
 */
export const translateKmToEn = async (text) => {
  if (!text || !text.trim()) return '';
  
  try {
    const encodedText = encodeURIComponent(text.trim());
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=km|en`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.responseData && data.responseData.translatedText) {
      // Decode HTML entities that MyMemory might return (e.g., &quot;)
      const txt = document.createElement('textarea');
      txt.innerHTML = data.responseData.translatedText;
      return txt.value;
    }
    
    return '';
  } catch (error) {
    console.error('Translation failed:', error);
    return '';
  }
};

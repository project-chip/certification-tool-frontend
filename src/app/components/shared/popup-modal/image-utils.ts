export function commaSeparatedHexToBase64(hexString: string) {
  // Split the string into an array
  const hexArray = hexString.split(',');

  // Convert each hex value to a byte
  const byteArray = hexArray.map(hex => parseInt(hex, 16));

  // Convert to binary string
  const binaryString = String.fromCharCode(...byteArray);

  // Encode to Base64
  return btoa(binaryString);
}

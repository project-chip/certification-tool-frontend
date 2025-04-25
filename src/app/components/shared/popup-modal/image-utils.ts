const base64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

function binary_to_base64(input: any) {
  var ret = '';
  var i = 0;
  var j = 0;
  var char_array_3 = new Array(3);
  var char_array_4 = new Array(4);
  var in_len = input.length;
  var pos = 0;

  while (in_len--) {
    char_array_3[i++] = input[pos++];
    if (i == 3) {
      char_array_4[0] = (char_array_3[0] & 0xfc) >> 2;
      char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + ((char_array_3[1] & 0xf0) >> 4);
      char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + ((char_array_3[2] & 0xc0) >> 6);
      char_array_4[3] = char_array_3[2] & 0x3f;

      for (i = 0; (i < 4); i++)
        ret += base64_chars.charAt(char_array_4[i]);
      i = 0;
    }
  }

  if (i) {
    for (j = i; j < 3; j++)
      char_array_3[j] = 0;

    char_array_4[0] = (char_array_3[0] & 0xfc) >> 2;
    char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + ((char_array_3[1] & 0xf0) >> 4);
    char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + ((char_array_3[2] & 0xc0) >> 6);
    char_array_4[3] = char_array_3[2] & 0x3f;

    for (j = 0; (j < i + 1); j++)
      ret += base64_chars.charAt(char_array_4[j]);

    while ((i++ < 3))
      ret += '=';
  }

  return ret;
}


function clean_hex(input: string, remove_0x: boolean) {
  input = input.toUpperCase();
  
  if (remove_0x) {
    input = input.replace(/0x/gi, "");
  }
  
  // var orig_input = input;
  input = input.replace(/[^A-Fa-f0-9]/g, "");
  // if (orig_input != input)
  //   alert("Warning! Non-hex characters in input string ignored.");
  return input;
}

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

export function convert_hex_to_base64(hexString: string) {
  var cleaned_hex = clean_hex(hexString, true);
  var binary = new Array();
  for (var i = 0; i < cleaned_hex.length / 2; i++) {
    var h = cleaned_hex.substring(i * 2, 2);
    binary[i] = parseInt(h, 16);
  }
  return binary_to_base64(binary);
}
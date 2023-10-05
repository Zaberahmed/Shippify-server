export const fakeData = () => {
  const countryData = [
    {
      country: "usa",
      value: "US",
      city: [
        {
          city: "New York",
          value: "NY",
          citys: [
            { city: "Albuquerque", postalcode: "87121" },
            { city: "Farmington", postalcode: "87402" },
            { city: "Los Alamos", postalcode: "87544" },
            { city: "Santa Fe", postalcode: "87506" },
            { city: "Gallup", postalcode: "87301" },
          ],
        },
        {
            city: "California",
            value: "CA",
            citys: [
              { city: "Bakersfield", postalcode: "93301" },
              { city: "Lancaster", postalcode: "93535" },
              { city: "Stanton", postalcode: "90680" },
              { city: "Visalia", postalcode: "93291" },
              { city: "San Francisco", postalcode: "94118" },
            ],
          },
          {
            city: "Texas",
            value: "TX",
            citys: [
              { city: "Fort Worth", postalcode: "76179" },
              { city: "Webster", postalcode: "77598" },
              { city: "Ennis", postalcode: "75119" },
              { city: "Irving", postalcode: "75062" },
              { city: "San Antonio", postalcode: "78207" },
            ],
          },
          {
            city: "Florida",
            value: "FL",
            citys: [
              { city: "Orange Park", postalcode: "32073" },
              { city: "Indian Harbour Beach", postalcode: "32937" },
              { city: "Avon Park", postalcode: "33825" },
              { city: "Tampa", postalcode: "33613" },
              { city: "Fleming Island", postalcode: "32003" },
            ],
          },
          {
            city: "Michigan",
            value: "MI",
            citys: [
              { city: "Grand Rapids", postalcode: "49507" },
              { city: "Birmingham", postalcode: "48009" },
              { city: "Roseville", postalcode: "48066" },
              { city: "Jackson", postalcode: "49201" },
              { city: "Kalamazoo", postalcode: "49006" },
            ],
          },
      ],
    },
    {
      country: "canada",
      value: "CA",
      city: [
        {
          city: "British Columbia",
          value: "BC",
          citys: [
            { city: "Vancouver", postalcode: "V6H 1H6" },
            // { city: "Farmington", postalcode: "L2G 7L9" },
            // { city: "Los Alamos", postalcode: "87544" },
            // { city: "Santa Fe", postalcode: "87506" },
            // { city: "Gallup", postalcode: "87301" },
          ],
        },
        {
            city: "Ontario",
            value: "ON",
            citys: [
              { city: "Niagara Falls", postalcode: "L2G 7L9" },
              { city: "Toronto", postalcode: "M5V 1J9" },
              { city: "Ottawa", postalcode: "K1P 1J1" },
              { city: "Mississauga", postalcode: "L5B 3C2" },
              { city: "Hamilton", postalcode: "L8P 1A1" },
            ],
          },
        //   {
        //     city: "Texas",
        //     value: "TX",
        //     citys: [
        //       { city: "Fort Worth", postalcode: "76179" },
        //       { city: "Webster", postalcode: "77598" },
        //       { city: "Ennis", postalcode: "75119" },
        //       { city: "Irving", postalcode: "75062" },
        //       { city: "San Antonio", postalcode: "78207" },
        //     ],
        //   },
        //   {
        //     city: "Florida",
        //     value: "FL",
        //     citys: [
        //       { city: "Orange Park", postalcode: "32073" },
        //       { city: "Indian Harbour Beach", postalcode: "32937" },
        //       { city: "Avon Park", postalcode: "33825" },
        //       { city: "Tampa", postalcode: "33613" },
        //       { city: "Fleming Island", postalcode: "32003" },
        //     ],
        //   },
        //   {
        //     city: "Michigan",
        //     value: "MI",
        //     citys: [
        //       { city: "Grand Rapids", postalcode: "49507" },
        //       { city: "Birmingham", postalcode: "48009" },
        //       { city: "Roseville", postalcode: "48066" },
        //       { city: "Jackson", postalcode: "49201" },
        //       { city: "Kalamazoo", postalcode: "49006" },
        //     ],
        //   },
      ],
    },
  ];

  return countryData;
};

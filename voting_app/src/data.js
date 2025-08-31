import Thumbnail1 from './assets/thumbnail2.jpg'
// Importing Candidates picture
import Candidate1 from './assets/img-1.jpg'
import Candidate2 from './assets/img-2.jpg'
import Candidate3 from './assets/img-3.jpg'
import Candidate4 from './assets/img-4.jpg'
import Candidate5 from './assets/img-5.jpg'
import Candidate6 from './assets/img-6.jpg'
import Candidate7 from './assets/img-7.jpg'
import Candidate8 from './assets/img-8.jpg'
import Candidate9 from './assets/img-9.jpg'
import Candidate10 from './assets/img-10.jpg'
import Candidate11 from './assets/img-11.jpg'
import Candidate12 from './assets/1mg-12.jpg'

export const elections = [
  {
    id: 'e1',
        title: 'Insititute of information Technology Presidential Election 2024',
    description: `The US Presidential Election takes place every four years on the first Tuesday in November. Candidate must be at least 35 years old, born in the United States and lived in the US for the previous 14 years in order to be eligible. Traditionally, candidates make their intention to run for President public in the year before the election takes place. Since there is no national authority which conducts the elections, local authorities organize the election with the help of thousands of administrators. `,
    thumbnail: Thumbnail1,
    candidates:['c1', 'c2'],
    voters: []
  },
  {
    id: 'e2',
    title: 'Insititute of information Technology Vice Presidential Election 2024',
    description: `The US Presidential Election takes place every four years on the first Tuesday in November. Candidate must be at least 35 years old, born in the United States and lived in the US for the previous 14 years in order to be eligible. Traditionally, candidates make their intention to run for President public in the year before the election takes place. Since there is no national authority which conducts the elections, local authorities organize the election with the help of thousands of administrators. `,
    thumbnail: Thumbnail1,
    candidates:['c3', 'c4'],  
    voters: []
  },
  {
    id: 'e3',
    title: 'Insititute of information Technology Sports Coordinator Election 2024',
    description: `The US Presidential Election takes place every four years on the first Tuesday in November. Candidate must be at least 35 years old, born in the United States and lived in the US for the previous 14 years in order to be eligible. Traditionally, candidates make their intention to run for President public in the year before the election takes place. Since there is no national authority which conducts the elections, local authorities organize the election with the help of thousands of administrators. `,
    thumbnail: Thumbnail1,
    candidates: ['c5', 'c6'],
    voters: []
  },
  {
    id: 'e4',
    title: 'Insititute of information Technology Media Handler Election 2024',
    description: `The US Presidential Election takes place every four years on the first Tuesday in November. Candidate must be at least 35 years old, born in the United States and lived in the US for the previous 14 years in order to be eligible. Traditionally, candidates make their intention to run for President public in the year before the election takes place. Since there is no national authority which conducts the elections, local authorities organize the election with the help of thousands of administrators. `,
    thumbnail: Thumbnail1,
    candidates: ['c7', 'c8'],
    voters: []
  },
  {
    id: 'e5',
    title: 'Insititute of information Technology Event Manager Election 2024',
    description: `The US Presidential Election takes place every four years on the first Tuesday in November. Candidate must be at least 35 years old, born in the United States and lived in the US for the previous 14 years in order to be eligible. Traditionally, candidates make their intention to run for President public in the year before the election takes place. Since there is no national authority which conducts the elections, local authorities organize the election with the help of thousands of administrators. `,
    thumbnail: Thumbnail1,
    candidates: ['c9', 'c10'],
    voters: []
  },
]

export const candidates= [
  {
    id: 'c1',
    fullName: 'Mian Usama',
    image: Candidate5,
    motto: 'Wants to make department more Good.',
    voteCount: 103,
    election: 'e1',
  },

  {
    id: 'c2',
    fullName: 'Usman Khan',
    image: Candidate12,
    motto: 'Wants to make department more Good.',
    voteCount: 40,
    election: 'e1',
  },
  {
    id: 'c3',
    fullName: 'Syed Saad Huraira',
    image: Candidate2,
    motto: 'Wants to make department more Good.',
    voteCount: 127,
    election: 'e2',
  },

  {
    id: 'c4',
    fullName: 'Usman Khalid',
    image: Candidate11,
    motto: 'Wants to make department more Good.',
    voteCount: 60,
    election: 'e2',
  },
  {
    id: 'c5',
    fullName: 'Jibran Ahmed',
    image: Candidate6,
    motto: 'Wants to make department more Good.',
    voteCount: 125,
    election: 'e3',
  },
  {
    id: 'c6',
    fullName: 'Junaid',
    image: Candidate3,
    motto: 'Wants to make department more Good.',
    voteCount: 70,
    election:'e3',
  }, 
  {
    id: 'c7',
    fullName: 'Luqman',
    image: Candidate9,
    motto: 'Wants to make department more Good.',
    voteCount: 90,
    election: 'e4',
  },

  {
    id: 'c8',
    fullName: 'Usman ',
    image: Candidate10,
    motto: 'Wants to make department more Good.',
    voteCount: 70,
    election: 'e4',
  },
  {
    id: 'c9',
    fullName: 'Abdul Rehman ',
    image: Candidate4,
    motto: 'Wants to make department more Good.',
    voteCount: 89,
    election: 'e5',
  },
  {
    id: 'c10',
    fullName: 'Abdul Muqeet Zafar ',
    image: Candidate7,
    motto: 'Wants to make department more Good.',
    voteCount: 123,
    election: 'e5',
  },



]
 
export const voters = [
  {
    id: 'v1',
    fullName: 'Hadeed Malik',
    email: 'hadeed786@gmail.com',
    password: 'hadeed1234',
    isAdmin: 'true',
    votedElections: ['e2']
  },
  {
    id: 'v2',
    fullName: 'Rasheed Baloch',
    email: 'rashi786@gmail.com',
    password: 'rashi1234',
    isAdmin: 'false',
    votedElections: ['e2']
  },
  {
    id: 'v3',
    fullName: 'Syed Naqeeb Ul Hassan',
    email: 'nageeb1212@gmail.com',
    password: 'naqeeb1234',
    isAdmin: 'false',
    votedElections: ['e1','e2']
  },
  {
    id: 'v4',
    fullName: 'Maayra Anjum',
    email: 'aira.anjum123@gmail.com',
    password: 'aira1234',
    isAdmin: 'true',
    votedElections: []
  },
]
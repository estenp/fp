/* eslint-disable no-unused-vars */

// Reducers

// Array.reduce? React.useReducer? Redux?
// (accumulator, value) => accumulator

// Array.reduce
// the Swiss Army Knife of Array methods
// when more specific methods don't seem to fit, reach for .reduce()
// if "reduce" feels like a misnomer try thinking in terms of cooking

const diceRoll = [5, 1, 6, 6, 6];

const diceRollIncremented = diceRoll.map(currentValue => {
  return currentValue + 1;
});

// basic reduce
const cumulativeDiceVals = diceRoll.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0);

// note: our returned value is NOT an array

////////

// count how many of each value
const counts = diceRoll.reduce((acc, curr) => {
  if (acc[curr]) {
    acc[curr] = acc[curr] + 1;
  } else {
    acc[curr] = 1
  }

  return acc;
}, {});

////////

// why reduce vs for loop?

let countz = {};
for (let i = 0; i < diceRoll.length; i++) {
  if (countz[diceRoll[i]]) {
    countz[diceRoll[i]] = countz[diceRoll[i]] + 1
  } else {
    countz[diceRoll[i]] = 1
  }
}

console.log(countz);

////////

// reduce is more declarative

// reducers.js
const frequency = (obj, val) => {
  obj[val] = obj[val] + 1 || 1;
  return obj;
};

// app
const diceCounts = diceRoll.reduce(frequency, {});

// still, other array methods offer a more specific utility. So is reduce less valuable as a utility than map, for example?
// reduce, isn't less specific, it's just specific in a different way. It specifically knows how to deal with a reducer, and this is very powerful.

// For example, React's `useReducer`

// reducers are great for performing transformations on data

////////
////////

// compose

// reduce can be used to write a `compose` utility
// it's like nesting function calls, but doesn't evaluate immediately

const string = 'Wow, that really kicks butt!';

const toUpper = string => string.toUpperCase();
const replaceButtWithBooty = string => string.replace('butt', 'booty');

const newString = toUpper(replaceButtWithBooty(string))

// a function that takes functions as arguments,
// and returns a function that will pipe an input through those arguments

// Basically,
// compose provides a way to pass the result of one function to the next function's parameter without nesting function calls

const censorAndUppercase = compose(toUpper, replaceButtWithBooty);
const modifiedString = censorAndUppercase(string);

function compose(...functions) {
  // [toUpper, replaceButtWithBooty]
  return function (initialString) {
    return functions.reduceRight((accumulatedString, currentFunction) => {
      return currentFunction(accumulatedString);
    }, initialString);
  };
};

const pipe =
  (...fns) =>
    arg =>
      fns.reduce((a, c) => c(a), arg);

// note: compose requires that each function's argument expects the return value from the previous

////////

// currying

// currying works well with compose
// say `.replace()` didn't make this easy, and we needed to make a function that took several args
const censor = (string, replace, replaceWith) => string.replace(replace, replaceWith);

// curried with data last lets you partially apply
const censor2 = replace => replaceWith => string => string.replace(replace, replaceWith);
const replaceButtWithBooty2 = censor2('butt')('booty');

const strArray = ['hello', 'dave', 'butt', 'green'];

const newStrings = strArray.map(replaceButtWithBooty).map(toUpper);

// now that we've produced a function that takes one argument, it can easily drop into a composition pipeline

////////

// transducers
// higher order reducer

// reducer = (accumulator, currentValue) => accumulator
// transducer = (reducer) => reducer
// OR
// ((accumulator, currentValue) => accumulator) =>
//    (accumulator, currentValue) => accumulator

// transducer
const stringModifierTransducer = pipe(
  // transducer
  prevReducer => {
    return (acc, curr) => {
      console.log(acc, curr);
      return prevReducer(acc, curr + ' 1st ');
    };
  },
  // transducer
  prevReducer => {
    return (acc, curr) => {
      console.log(acc, curr);
      return prevReducer(acc, curr + ' 2nd ');
    };
  },
);

const stringModifierReducer = stringModifierTransducer((acc, curr) => {
  acc.push(curr)
  return acc;
});

const transduceStrings = ['this', 'that', 'other'].reduce(stringModifierReducer, []);

const accumulateArray = (acc, curr) => [...acc, curr];

////////

const makeMapTransducer = mapperFn => reducer => (a, c) => reducer(a, mapperFn(c));

const makeFilterTransducer = predicate => reducer => (a, c) => predicate(c) ? reducer(a, c) : a;

const capAndCensorReducer = compose(
  makeMapTransducer(replaceButtWithBooty),
  makeMapTransducer(toUpper)
)(accumulateArray);

const capAndCensoredStrings = ['this', 'that', 'other'].reduce(capAndCensorReducer, []);

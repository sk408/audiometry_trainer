const { performance } = require('perf_hooks');

function generateThresholds(count) {
  const thresholds = [];
  const ears = ['left', 'right'];
  const testTypes = ['air', 'bone', 'masked_air', 'masked_bone'];
  const frequencies = [125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];

  for (let i = 0; i < count; i++) {
    thresholds.push({
      frequency: i, // Unique frequency to prevent early exits in .find()
      ear: ears[0],
      testType: testTypes[0],
      hearingLevel: 0,
      responseStatus: 'threshold',
    });
  }
  return thresholds;
}

function originalSearch(userThresholds, actualThresholds) {
  let comparedCount = 0;
  userThresholds.forEach(userT => {
    const matchingActual = actualThresholds.find(
      actT =>
        actT.frequency === userT.frequency &&
        actT.ear === userT.ear &&
        actT.testType === userT.testType
    );
    if (matchingActual) {
      comparedCount++;
    }
  });
  return comparedCount;
}

function optimizedSearch(userThresholds, actualThresholds) {
  let comparedCount = 0;
  const actualMap = new Map();
  actualThresholds.forEach(actT => {
    const key = `${actT.frequency}-${actT.ear}-${actT.testType}`;
    actualMap.set(key, actT);
  });

  userThresholds.forEach(userT => {
    const key = `${userT.frequency}-${userT.ear}-${userT.testType}`;
    const matchingActual = actualMap.get(key);
    if (matchingActual) {
      comparedCount++;
    }
  });
  return comparedCount;
}

const count = 10000;
const userThresholds = generateThresholds(count);
const actualThresholds = generateThresholds(count);

// Shuffle userThresholds to simulate random access
userThresholds.sort(() => Math.random() - 0.5);

console.log(`Running benchmark with ${count} thresholds...`);

const startOriginal = performance.now();
const resultOriginal = originalSearch(userThresholds, actualThresholds);
const endOriginal = performance.now();
const timeOriginal = (endOriginal - startOriginal).toFixed(4);
console.log(`Original O(N^2) search: ${timeOriginal}ms (result: ${resultOriginal})`);

const startOptimized = performance.now();
const resultOptimized = optimizedSearch(userThresholds, actualThresholds);
const endOptimized = performance.now();
const timeOptimized = (endOptimized - startOptimized).toFixed(4);
console.log(`Optimized O(N) search: ${timeOptimized}ms (result: ${resultOptimized})`);

if (resultOriginal !== resultOptimized) {
  console.log(`Results: Original=${resultOriginal}, Optimized=${resultOptimized}`);
}

const improvement = ((timeOriginal - timeOptimized) / timeOriginal * 100).toFixed(2);
console.log(`Improvement: ${improvement}%`);

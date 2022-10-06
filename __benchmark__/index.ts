import Benchmark from 'benchmark';

const suite = new Benchmark.Suite;

// add tests
suite.add('RegExp#test', function() {
    /o/.test('Hello World!');
    })
    .add('String#indexOf', function() {
        'Hello World!'.indexOf('o') > -1;
    })
    .add('String#match', function() {
        !!'Hello World!'.match(/o/);
    })
    // add listeners
    .on('cycle', function(event: { target: any; }) {
        console.log(String(event.target));
    })
    .on('complete', function() {
        // @ts-ignore
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    // run async
    .run({ 'async': true });
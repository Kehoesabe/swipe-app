/**
 * Test that verifies the SwipeCard component can be imported
 */
describe('SwipeCard (import test)', () => {
  test('can be imported without errors', () => {
    // This test just verifies that the component can be imported
    // without throwing any errors
    expect(() => {
      require('@/components/SwipeCard/SwipeCard');
    }).not.toThrow();
  });
});








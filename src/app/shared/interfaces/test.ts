/* eslint-disable @typescript-eslint/naming-convention */
export interface TestCase {
  public_id: string;
  iterations: number;
}

export interface TestSuite {
  public_id: string;
  test_cases: TestCase[];
}

export interface Collection {
  public_id: string;
  test_suites: TestSuite[];
}

export interface SelectedTests {
  collections: Collection[];
}

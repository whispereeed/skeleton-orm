import './network'
import { useFixturesByGET } from './nockConfig'

import { collection } from './collection'
import { modelToJSON } from 'datx'
import Department from './models/Department'

describe('sync', () => {
  let scope: any = null

  beforeAll(() => {
    scope = useFixturesByGET()
  })

  beforeEach(() => {
    collection.removeAll(Department)
  })

  const cases = (sf: Department[]) => {
    expect(sf[0].children[0].parentId === sf[0]).toBeTruthy()
    expect(collection.findAll(Department).length).toBe(2035)

    const dd = collection.findOne<Department>(Department, '6Rk9l1WYNM0400:50128173')
    expect(dd.parentId.id).toBe('6Rk9l1WYNM0400:1')
    expect(dd.name).toBe('研发总部')
    expect(dd.active).toBe(true)
    expect(modelToJSON(dd)).toMatchSnapshot()
  }

  const data: object[] = require('./fixtures/organization.departments.json').items

  test('sync 1', () => {
    const sf = collection.sync<Department[]>({
      type: 'organization.Department',
      data: data
    })
    cases(sf)
  })

  test('sync 2', () => {
    const sf = collection.sync<Department[]>(Department, data)
    cases(sf)
  })
})
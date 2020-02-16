import { PropertyInShow } from 'admin-bro'
import React from 'react'

const element = (props) => {
  const { record, property } = props
  const p = {
    label: "Photo's",
    name: 'photosAllowed',
  }
  return (
    <PropertyInShow property={p}>
      { record.params['general_questions.0'] == 'photo' &&
        <span>Allowed</span>
      }
      { record.params['general_questions.0'] != 'photo' &&
        <span>Not Allowed</span>
      }
    </PropertyInShow>
  )
};

export default element 
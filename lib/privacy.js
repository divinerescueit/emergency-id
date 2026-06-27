// Applies the user's chosen privacy mode to their stored profile
// before it is sent to the browser. This runs SERVER-SIDE
// (in getServerSideProps), so the filtered-out fields never reach
// the client at all.
//
// Modes:
//   public  - show everything
//   limited - name, blood group, emergency contacts only
//   medical - medical info + emergency contacts only (no name)
//   hidden  - emergency contacts only, no personal/medical details

export function filterProfileForPublicView(record) {
  const base = {
    id: record.id,
    privacy: record.privacy || 'public',
    contacts: record.contacts || [],
  };

  switch (record.privacy) {
    case 'hidden':
      return {
        ...base,
        name: null,
        age: null,
        gender: null,
        blood: null,
        donor: null,
        allergies: null,
        conditions: null,
        meds: null,
      };

    case 'limited':
      return {
        ...base,
        name: record.name,
        blood: record.blood,
        age: null,
        gender: null,
        donor: null,
        allergies: null,
        conditions: null,
        meds: null,
      };

    case 'medical':
      return {
        ...base,
        name: null,
        age: record.age,
        gender: record.gender,
        blood: record.blood,
        donor: record.donor,
        allergies: record.allergies,
        conditions: record.conditions,
        meds: record.meds,
      };

    case 'public':
    default:
      return {
        ...base,
        name: record.name,
        age: record.age,
        gender: record.gender,
        blood: record.blood,
        donor: record.donor,
        allergies: record.allergies,
        conditions: record.conditions,
        meds: record.meds,
      };
  }
}

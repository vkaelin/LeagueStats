module.exports = {
  /**
    * Sort array of Roles according to a specific order
    * @param a first role
    * @param b second role
    */
  sortTeamByRole(a, b) {
    const sortingArr = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT']
    return sortingArr.indexOf(a.role) - sortingArr.indexOf(b.role)
  },
}

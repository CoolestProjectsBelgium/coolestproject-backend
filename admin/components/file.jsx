import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

export const File = ({record}) => {
    return (
        <a href={record.params.downloadLink} target="_blank">download</a>
    )
}

export default File
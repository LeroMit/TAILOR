import React, { useState } from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'
import { Chip } from 'react-native-paper'
import { hexy } from '@/utils'

const screenWidth = Dimensions.get('window').width
const marginBetweenTags = 5
const tagPaddingHorizontal = 10

const TagRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`

const TagsBag: React.FC<{
  tags: string[]
  canBeSelected: boolean
  onTagPress?: (tag: string) => void
  setterSelectedTags?: (tags: string[]) => void
}> = ({ tags, canBeSelected, onTagPress, setterSelectedTags }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleTagPress = (tag: string, canBeSelected: boolean) => {
    if (canBeSelected) {
      if (selectedTags.includes(tag)) {
        setSelectedTags(selectedTags.filter((t) => t !== tag))
        setterSelectedTags(selectedTags.filter((t) => t !== tag))
      } else {
        setSelectedTags([...selectedTags, tag])
        setterSelectedTags([...selectedTags, tag])
      }
      onTagPress(tag)
    }
  }

  const rows: string[][] = [] // Array to store tags by line
  let currentRowWidth = 0
  let currentRow: string[] = []

  tags.forEach((tag) => {
    const tagWidth = tag.length * 8 // Estimated width of tag wrt to number of char

    if (
      currentRowWidth +
        tagWidth +
        marginBetweenTags +
        2 * tagPaddingHorizontal <=
      screenWidth * 0.65
    ) {
      currentRow.push(tag)
      currentRowWidth += tagWidth + marginBetweenTags + 2 * tagPaddingHorizontal
    } else {
      if (currentRow.length > 0) {
        rows.push(currentRow)
      }
      currentRow = [tag]
      currentRowWidth = tagWidth + 2 * tagPaddingHorizontal
    }
  })

  if (currentRow.length > 0) {
    rows.push(currentRow)
  }

  return (
    <>
      {rows.map((row, index) => (
        <TagRow key={index}>
          {row.map((tag, tagIndex) => (
            <Chip
              key={tagIndex}
              mode="outlined"
              onPress={() => handleTagPress(tag, canBeSelected)}
              style={{
                marginHorizontal: marginBetweenTags,
                marginVertical: 2,
                backgroundColor: hexy(),
                borderRadius: 20,
              }}
              textStyle={{ color: 'white' }}
              selected={selectedTags.includes(tag)}
            >
              {tag}
            </Chip>
          ))}
        </TagRow>
      ))}
    </>
  )
}

export default TagsBag

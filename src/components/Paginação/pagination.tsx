import { Button, Flex, Icon } from '@chakra-ui/react';

const MAX_ITEMS = 3;
const MAX_LEFT = (MAX_ITEMS - 1) / 2;

import {BsChevronLeft, BsChevronRight} from 'react-icons/bs';

export function Pagination ({total,page,setPage}) {

  var current = page;
  const pages = Number(total);
  const maxFirst = Math.max((total - 1)- (MAX_ITEMS - 1), 0);
  const first = Math.min(
    Math.max(current - MAX_LEFT, 0),
    maxFirst
  );

  function onPageChange(page) {
    setPage(page);
  }

  return (
    
    <Flex className="pagination" align="center" display={pages == 0 ? "none" : "flex"}>
      
        <Button
          onClick={() => onPageChange(current == 0?  0 : current - 1)}
          disabled={current === 1}
          fontSize="0.85rem"
          color="gray.200"
          _hover={{opacity: '0.7'}}
        >
          <Icon as={BsChevronLeft}/>
        </Button>
          
          {Array.from({ length: Math.min(MAX_ITEMS, pages) })
          .map((_, index) => index + first)
          .map((p) =>{
            return(
                <Button onClick={() => {onPageChange(p)}} bg={p == page ? "blue.100" : "gray.100"} color="white" fontSize="0.85rem" size="sm" _hover={{opacity: '0.7'}}>
                    {p + 1}
                </Button>
            )
          })
          }

        <Button
          onClick={() => onPageChange(current == total - 1 ? page : current + 1)}
          disabled={current === page}
          fontSize="0.85rem"
          color="white"
          _hover={{opacity: '0.7'}}
        >
          <Icon as={BsChevronRight}/>
        </Button>

    </Flex>
  );
};


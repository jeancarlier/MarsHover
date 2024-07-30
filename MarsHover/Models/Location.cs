using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MarsHover.Models
{
    public class Location: ILocation
    {        
        private int X;
        private int Y;
        private HeadTo headingTo;

        public Location()
        {
            X = 0;
            Y = 0;
            headingTo = HeadTo.N;            
        }

        public Location(string[] location)
        {            
            int.TryParse(location[0],out X);
            int.TryParse(location[1],out Y);
            headingTo = (HeadTo)Enum.Parse(typeof(HeadTo), location[2]);
        }

        public enum HeadTo
        {
            N = 1,
            W = 2,
            S = 3,
            E = 4
        }

        private void Move()
        {
            
        }

        private void ChangeDirection(char direction)
        {
            switch (headingTo)
            {
                case HeadTo.N:
                    headingTo = direction == 'L' ? HeadTo.W : HeadTo.E; 
                    break;
                case HeadTo.E:
                    headingTo = direction == 'L' ? HeadTo.N : HeadTo.S;
                    break;
                case HeadTo.S:
                    headingTo = direction == 'L' ? HeadTo.E : HeadTo.W;
                    break;
                case HeadTo.W:
                    headingTo = direction == 'L' ? HeadTo.S : HeadTo.N;
                    break;
            }
        }

        private void Advance()
        {
            switch (headingTo)
            {
                case HeadTo.N:
                    Y++;
                    break;
                case HeadTo.W:
                    X--;
                    break;
                case HeadTo.S:
                    Y--;
                    break;
                case HeadTo.E:
                    X++;
                    break;
                default:
                    break;
            }
        }

        private void Move(char movement)
        {
            switch (movement)
            {
                case 'L':
                    ChangeDirection(movement);
                    break;
                case 'R':
                    ChangeDirection(movement);
                    break;
                case 'M':
                    Advance();
                    break;
            }
        }

        public string Navigate(string input)
        {
            var charInput = input.ToCharArray();
            
            for (int i = 0; i < charInput.Length - 1; i++)
            {
                Move(charInput[i]);
            }

            return X + " " + Y + " " + headingTo;
        }         
    }
}